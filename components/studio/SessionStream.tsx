"use client";

import { useEffect, useState, useRef } from "react";

const mockLogs = [
  { id: 1, type: "system", msg: "Orchestration Layer v10.4 Initialized.", time: "10:22:04" },
  { id: 2, type: "agent", agent: "KC", msg: "Scanning marketplace for urgency signals...", time: "10:22:05" },
  { id: 3, type: "audit", msg: "SafeSkill Audit: Handshake confirmed with Clerk Auth.", time: "10:22:07" },
  { id: 4, type: "action", msg: "Dispatched GigAlert to +27******245 (WhatsApp)", time: "10:22:10" },
  { id: 5, type: "thinking", agent: "Claude", msg: "Optimizing token discipline for regional latency.", time: "10:22:15" },
];

export default function SessionStream() {
  const [logs] = useState(mockLogs);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="kasi-card flex flex-col h-[480px] border-outline-variant/40 bg-[#0A0A0A] text-[#E0E0E0] shadow-2xl">
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-outline">Live Execution Stream</h3>
        </div>
        <div className="text-[10px] font-mono text-primary font-bold">MODE: PERSISTENT_TRACE</div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-outline-variant/30"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 group leading-relaxed">
            <span className="text-[9px] font-mono text-outline/50 mt-1 shrink-0">{log.time}</span>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  log.type === 'system' ? 'text-primary' : 
                  log.type === 'agent' ? 'text-success' :
                  log.type === 'audit' ? 'text-secondary' :
                  log.type === 'thinking' ? 'text-warning' : 'text-outline'
                }`}>
                  [{log.agent || log.type}]
                </span>
                <div className="flex-1 h-[1px] bg-outline-variant/10 group-hover:bg-outline-variant/30 transition-colors" />
              </div>
              <p className="text-[13px] font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
                {log.msg}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <span className="text-success flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-success"></span>
            CONNECTED
          </span>
          <span className="text-outline">LATENCY: 42ms</span>
        </div>
        <button className="text-[11px] font-bold text-primary hover:underline">Download Trace.log</button>
      </div>
    </div>
  );
}
