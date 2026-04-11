"use client";

import { CheckCircleIcon } from "lucide-react";

const audits = [
  { id: 1, action: "Tool Access: search_web", status: "Verified", risk: "Low", auth: "SafeSkill v2" },
  { id: 2, action: "File Mutation: app/layout.tsx", status: "Audited", risk: "High", auth: "Master Approval" },
  { id: 3, action: "API Outbound: whin2", status: "Encryption Active", risk: "Medium", auth: "Clerk-Signed" },
];

export default function SafeSkillAudit() {
  return (
    <div className="kasi-card border-outline-variant/40 bg-surface-container shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">SafeSkill Trust Engine</h3>
          <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest mt-1">Audit-Twice Verification</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/30">
          <CheckCircleIcon size={20} />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {audits.map((audit) => (
          <div key={audit.id} className="group relative flex items-start gap-4">
            <div className="mt-1.5 flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-success ring-4 ring-success/10 group-hover:ring-success/20 transition-all" />
              <div className="w-[1px] h-12 bg-outline-variant/30 mt-2" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-on-surface tracking-tight">{audit.action}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                  audit.risk === 'Low' ? 'border-success/30 text-success bg-success/5' :
                  audit.risk === 'Medium' ? 'border-warning/30 text-warning bg-warning/5' :
                  'border-danger/30 text-danger bg-danger/5'
                }`}>
                  {audit.risk.toUpperCase()} RISK
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-on-surface-variant font-medium">
                <span className="text-success">{audit.status}</span>
                <span className="text-outline">via {audit.auth}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full py-3 rounded-2xl bg-on-surface text-surface text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity">
        View Full System Audit
      </button>
    </div>
  );
}
