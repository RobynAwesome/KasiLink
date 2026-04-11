"use client";

import { useState } from "react";

const agents = [
  { id: "gemini", name: "Gemini 3 Flash", status: "Active", latency: "140ms", color: "#4285F4" },
  { id: "grok", name: "xAI Grok", status: "Standby", latency: "210ms", color: "#F5A623" },
  { id: "claude", name: "Claude 4.6", status: "Optimizer", latency: "380ms", color: "#ea580c" },
];

export default function AgentOrchestrator() {
  const [activeId, setActiveId] = useState("gemini");

  return (
    <div className="kasi-card border-outline-variant/40 bg-surface-container-low shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Agent Orchestration</h3>
          <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest mt-1">Multi-Model Switching</p>
        </div>
        <div className="flex gap-1 bg-background/50 p-1 rounded-full border border-outline-variant/30">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setActiveId(agent.id)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                activeId === agent.id 
                  ? "bg-primary text-on-primary shadow-lg" 
                  : "text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              {agent.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {agents.map((agent) => (
          <div 
            key={agent.id} 
            className={`p-4 rounded-2xl border transition-all duration-300 ${
              activeId === agent.id 
                ? "border-primary/50 bg-primary/10 scale-[1.02]" 
                : "border-outline-variant/20 bg-background/30 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between leading-none">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full animate-pulse" 
                  style={{ backgroundColor: agent.color }}
                />
                <span className="font-bold text-sm">{agent.name}</span>
              </div>
              <span className="text-[10px] font-mono text-outline">{agent.latency}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="text-on-surface-variant">Role: {agent.status}</span>
              <button 
                className={`transition-colors font-bold ${
                  activeId === agent.id ? "text-primary" : "text-outline pointer-events-none"
                }`}
              >
                Configure →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-outline-variant/20">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">Total Context Window</span>
          <span className="font-mono text-primary font-bold">1.2M tokens</span>
        </div>
        <div className="mt-2 w-full h-1 bg-surface-variant rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[65%] rounded-full shadow-[0_0_8px_var(--primary)]" />
        </div>
      </div>
    </div>
  );
}
