"use client";

import { useState, useEffect } from "react";
import { Zap, AlertTriangle, CheckCircle, Clock, ExternalLink } from "lucide-react";

interface Props {
  suburb?: string;
}

type Stage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const STAGE_ADVICE: Record<number, { label: string; colour: string; hint: string; slots: string[] }> = {
  0: {
    label: "No load shedding",
    colour: "text-success",
    hint: "Power is stable right now — good time to post and start work.",
    slots: [],
  },
  1: {
    label: "Stage 1",
    colour: "text-warning",
    hint: "2 hours off per day. Plan gigs that need power (tools, appliances) outside the cut window.",
    slots: ["06:00–08:00", "14:00–16:00", "22:00–00:00"],
  },
  2: {
    label: "Stage 2",
    colour: "text-warning",
    hint: "4 hours off per day in 2-hour slots. Confirm your suburb's schedule before committing.",
    slots: ["06:00–08:00", "10:00–12:00", "18:00–20:00"],
  },
  3: {
    label: "Stage 3",
    colour: "text-error",
    hint: "6 hours off per day. Avoid power-dependent gigs unless you have backup. Prefer morning slots.",
    slots: ["06:00–08:00", "12:00–14:00", "20:00–22:00"],
  },
  4: {
    label: "Stage 4",
    colour: "text-error",
    hint: "8 hours off per day. Reschedule power-critical work. Battery, solar, and manual gigs still work.",
    slots: ["06:00–08:00", "10:00–12:00", "14:00–16:00", "20:00–22:00"],
  },
};

function getAdvice(stage: number) {
  if (stage >= 4) return STAGE_ADVICE[4];
  return STAGE_ADVICE[stage] ?? STAGE_ADVICE[0];
}

const POWER_CATEGORIES = ["repairs", "solar", "handyman", "construction", "retail"];

export default function UtilityRescheduler({ suburb }: Props) {
  const [stage, setStage] = useState<Stage | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function check() {
      setLoading(true);
      try {
        const res = await fetch("/api/load-shedding");
        if (res.ok) {
          const data = await res.json();
          setStage((data.stage ?? 0) as Stage);
        } else {
          setStage(0);
        }
      } catch {
        setStage(0);
      } finally {
        setLoading(false);
      }
    }
    check();
  }, [suburb]);

  if (dismissed) return null;

  const advice = stage !== null ? getAdvice(stage) : null;
  const isAlert = stage !== null && stage > 0;

  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${
        isAlert
          ? "border-warning/40 bg-warning/5"
          : "border-success/30 bg-success/5"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {loading ? (
            <Zap size={16} className="text-outline animate-pulse" />
          ) : isAlert ? (
            <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
          ) : (
            <CheckCircle size={16} className="text-success shrink-0 mt-0.5" />
          )}
          <span className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">
            Kopano Context — Utility Check
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-outline hover:text-on-surface-variant text-xs leading-none"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>

      {loading ? (
        <p className="mt-3 text-sm text-outline animate-pulse">
          Checking current load-shedding stage…
        </p>
      ) : advice ? (
        <div className="mt-3 space-y-3">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${advice.colour}`}>
              {advice.label}
            </span>
            {suburb && (
              <span className="text-xs text-outline">· {suburb}</span>
            )}
          </div>

          <p className="text-sm text-on-surface-variant leading-relaxed">
            {advice.hint}
          </p>

          {isAlert && advice.slots.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2 flex items-center gap-1">
                <Clock size={10} />
                Suggested power-safe windows
              </p>
              <div className="flex flex-wrap gap-2">
                {advice.slots.map((slot) => (
                  <span
                    key={slot}
                    className="rounded-lg bg-background border border-outline-variant/30 px-2.5 py-1 text-xs font-semibold text-on-surface-variant"
                  >
                    {slot}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-outline mt-2">
                Add preferred hours to your gig description so applicants can plan around cuts.
              </p>
            </div>
          )}

          <a
            href="https://github.com/RobynAwesome/Introduction-to-MCP"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
          >
            Powered by Kopano Context
            <ExternalLink size={9} />
          </a>
        </div>
      ) : null}
    </div>
  );
}
