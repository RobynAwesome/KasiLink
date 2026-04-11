"use client";

import { Box, Shield, Zap, Database, MessageSquare } from "lucide-react";

export default function SystemMap() {
  return (
    <div className="kasi-card border-outline-variant/40 bg-gradient-to-br from-[#121212] to-[#0A0A0A] overflow-hidden shadow-2xl relative">
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-white">System Map</h3>
        <p className="text-xs text-outline font-medium uppercase tracking-widest mt-1">Operational Topology</p>
      </div>

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
      </div>

      <div className="mt-12 relative flex flex-col items-center gap-12 py-8">
        {/* Core Engine */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all" />
          <div className="relative w-20 h-20 bg-background border-2 border-primary rounded-3xl flex items-center justify-center text-primary shadow-2xl shadow-primary/20">
            <Zap size={32} />
          </div>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap">Kopano Core</span>
        </div>

        {/* Outer Layers */}
        <div className="grid grid-cols-2 gap-x-24 gap-y-16">
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-surface-container border border-outline-variant/50 rounded-2xl flex items-center justify-center text-on-surface">
              <Database size={24} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-outline">Persistence</span>
          </div>

          <div className="relative flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-surface-container border border-outline-variant/50 rounded-2xl flex items-center justify-center text-on-surface">
              <Shield size={24} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-outline">SafeSkill</span>
          </div>

          <div className="relative flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-surface-container border border-outline-variant/50 rounded-2xl flex items-center justify-center text-on-surface">
              <MessageSquare size={24} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-outline">Bridge API</span>
          </div>

          <div className="relative flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-surface-container border border-outline-variant/50 rounded-2xl flex items-center justify-center text-on-surface">
              <Box size={24} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-outline">Registry</span>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-variant/40 border border-outline-variant/20">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-mono text-on-surface-variant font-bold">HEALTH: 100% (23ms)</span>
        </div>
      </div>
    </div>
  );
}
