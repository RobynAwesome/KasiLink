"use client";

import { KeyboardEvent, useRef } from "react";

const SKINS = [
  {
    id: "default" as const,
    name: "KasiLink Default",
    description: "Clean, minimal design that matches the rest of the app.",
    color: "bg-primary",
    gradient: false,
  },
  {
    id: "whatsapp" as const,
    name: "WhatsApp",
    description: "Classic familiarity with high-contrast bubbles and delivery ticks.",
    color: "bg-[#075E54]",
    gradient: false,
  },
  {
    id: "discord" as const,
    name: "Discord",
    description: "Dark-themed compact layout for rapid-fire community chat.",
    color: "bg-[#5865F2]",
    gradient: false,
  },
  {
    id: "instagram" as const,
    name: "Instagram",
    description: "Vibrant gradients and modern rounded bubbles for the aesthetic-focused.",
    color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    gradient: true,
  },
];

export type SkinId = "default" | "whatsapp" | "discord" | "instagram";

interface SkinSelectorProps {
  activeSkin: SkinId;
  onSkinChange: (skin: SkinId) => void;
}

export default function SkinSelector({ activeSkin, onSkinChange }: SkinSelectorProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onSkinKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowLeft" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }
    event.preventDefault();

    let nextIndex = index;
    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % SKINS.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + SKINS.length) % SKINS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = SKINS.length - 1;
    }

    onSkinChange(SKINS[nextIndex].id);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
      role="radiogroup"
      aria-label="Chat skin selector"
    >
      {SKINS.map((skin) => {
        const isActive = activeSkin === skin.id;
        const index = SKINS.findIndex((item) => item.id === skin.id);
        return (
          <button
            key={skin.id}
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            onClick={() => onSkinChange(skin.id)}
            onKeyDown={(event) => onSkinKeyDown(event, index)}
            role="radio"
            aria-checked={isActive}
            aria-label={`${skin.name} skin`}
            className={`rounded-xl overflow-hidden border-2 transition-all text-left ${
              isActive
                ? "border-primary shadow-lg"
                : "border-outline-variant hover:border-primary/50"
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
          >
            <div className={`h-16 ${skin.gradient ? skin.color : ""} relative`}>
              {!skin.gradient && (
                <div className={`absolute inset-0 ${skin.color}`} />
              )}
              {isActive && (
                <div className="absolute top-2 right-2 bg-primary text-on-primary text-[10px] px-2 py-0.5 rounded-full font-bold z-10">
                  ACTIVE
                </div>
              )}
            </div>
            <div className="p-3 bg-surface-container">
              <h4 className="font-bold text-sm mb-1">{skin.name}</h4>
              <p className="text-[11px] text-on-surface-variant line-clamp-2">
                {skin.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
