"use client";

import SessionStream from "@/components/studio/SessionStream";
import AgentOrchestrator from "@/components/studio/AgentOrchestrator";
import SafeSkillAudit from "@/components/studio/SafeSkillAudit";
import SystemMap from "@/components/studio/SystemMap";
import KCActivityPanel from "@/components/studio/KCActivityPanel";
import { Eyebrow } from "@/components/ui/PagePrimitives";
import Link from "next/link";
import { Zap, Command, ShieldCheck, Activity, ExternalLink } from "lucide-react";

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-on-background pb-12 pt-16">
      <div className="container py-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
          <div className="space-y-4">
            <Eyebrow tone="success">Kopano Labs — Intelligence Layer</Eyebrow>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-4">
              <span className="text-primary"><Zap size={48} /></span>
              Kopano <span className="text-outline-variant italic">Studio</span>
            </h1>
            <p className="text-on-surface-variant max-w-xl text-lg font-medium leading-relaxed">
              Real-time orchestration control plane for KasiLink.
              Monitor KC activity, agent health, and system signals in one view.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://context.kopanolabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline border-primary/40 text-primary text-xs font-bold uppercase tracking-widest px-6 h-12 rounded-2xl hover:bg-primary/10 inline-flex items-center gap-2"
            >
              Full KC Platform
              <ExternalLink size={12} />
            </a>
            <button className="btn btn-primary text-xs font-black uppercase tracking-widest px-8 h-12 rounded-2xl shadow-[0_12px_44px_rgba(69,149,192,0.4)]">
              Restart Core
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Agents", value: "3", icon: <Command size={14} />, color: "text-primary" },
            { label: "Audit Health", value: "100%", icon: <ShieldCheck size={14} />, color: "text-success" },
            { label: "Request Rate", value: "128/m", icon: <Activity size={14} />, color: "text-warning" },
            { label: "Session ID", value: "0x8F2D", icon: <Zap size={14} />, color: "text-secondary" },
          ].map((stat, i) => (
            <div 
              key={stat.label} 
              className="kasi-card p-4 flex flex-col items-start gap-1 border-outline-variant/20 bg-surface-container-low animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`flex items-center gap-2 ${stat.color} font-bold text-[10px] uppercase tracking-widest`}>
                {stat.icon}
                {stat.label}
              </div>
              <div className="text-2xl font-black mt-1 leading-none">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Main Execution Column */}
          <div className="space-y-6">
            <SessionStream />
            <div className="grid gap-6 sm:grid-cols-2">
              <AgentOrchestrator />
              <SafeSkillAudit />
            </div>
          </div>

          {/* Side Analytics Column */}
          <aside className="space-y-6">
            <KCActivityPanel />
            <SystemMap />
            <div className="kasi-card border-outline-variant/30 bg-surface-container-high relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Command size={80} />
              </div>
              <h3 className="text-lg font-bold">Pro-Mode Config</h3>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                Manually adjust the reasoning depth and token priority for the 
                township marketplace matching engine.
              </p>
              <Link href="/settings" className="btn btn-outline btn-sm mt-6 w-full justify-center">
                Access Advanced Parameters
              </Link>
            </div>

            <div className="kasi-card border-outline-variant/30 bg-primary/5 border-primary/20">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary">Observer Insights</h3>
              <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">
                The current session is performing with **98.2% accuracy**. All 
                hallucinations have been intercepted by the SafeSkill layer.
              </p>
              <div className="mt-4 p-3 bg-background/50 rounded-xl border border-primary/10">
                <p className="text-[10px] font-mono text-primary font-bold">LATEST_EVAL: PASS</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
