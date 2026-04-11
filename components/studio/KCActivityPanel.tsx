"use client";

const kcTasks = [
  { id: "T1", title: "Marketplace loading skeleton", status: "COMPLETE", type: "code" },
  { id: "T2", title: "Forum loading skeleton", status: "COMPLETE", type: "code" },
  { id: "T3", title: "Verified loading skeleton", status: "COMPLETE", type: "code" },
  { id: "T4", title: "Terms page lint fixes", status: "COMPLETE", type: "code" },
  { id: "T5", title: "Next task — pending dispatch", status: "PENDING", type: "code" },
];

const kcIdeas = [
  { id: "006", title: "KC as community moderation agent" },
  { id: "012", title: "KC monitoring dashboard" },
  { id: "013", title: "2nd Brain auto-update hook" },
];

const phaseMap: Record<string, { label: string; color: string }> = {
  "Intern-Dev": { label: "Intern-Dev", color: "text-warning" },
  "DEV_KC": { label: "DEV_KC", color: "text-primary" },
  "Junior Lead": { label: "Junior Lead", color: "text-success" },
};

const currentPhase = "Intern-Dev";

const statusColors: Record<string, string> = {
  COMPLETE: "text-success",
  PENDING: "text-outline",
  ACTIVE: "text-primary",
  BLOCKED: "text-danger",
};

export default function KCActivityPanel() {
  return (
    <div className="kasi-card flex flex-col gap-5 border-outline-variant/30 bg-[#080808] text-on-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
            Kopano Labs Intelligence
          </p>
          <h3 className="mt-1 text-lg font-black">KC Activity</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className={`text-xs font-bold uppercase ${phaseMap[currentPhase]?.color}`}>
            {phaseMap[currentPhase]?.label}
          </span>
        </div>
      </div>

      {/* Phase progress */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline mb-2">
          Development Phase
        </p>
        <div className="flex items-center gap-2">
          {["Observer", "Intern-Dev", "DEV_KC", "Junior Lead", "Co-Lead"].map((phase, i) => (
            <div key={phase} className="flex items-center gap-2">
              <div className={`flex flex-col items-center gap-1`}>
                <div className={`h-2 w-2 rounded-full ${
                  phase === currentPhase ? "bg-primary ring-2 ring-primary/30" :
                  i < ["Observer", "Intern-Dev"].indexOf(currentPhase) + 1 ? "bg-success" :
                  "bg-outline-variant/30"
                }`} />
                <span className={`text-[8px] font-mono whitespace-nowrap ${
                  phase === currentPhase ? "text-primary font-bold" : "text-outline"
                }`}>{phase}</span>
              </div>
              {i < 4 && <div className="h-[1px] w-4 bg-outline-variant/20 mb-3" />}
            </div>
          ))}
        </div>
      </div>

      {/* Task log */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline mb-2">
          Task Log
        </p>
        <div className="space-y-2">
          {kcTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between rounded-lg border border-outline-variant/20 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-outline">{task.id}</span>
                <span className="text-xs text-on-surface-variant">{task.title}</span>
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wide ${statusColors[task.status] ?? "text-outline"}`}>
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ideas KC flagged */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline mb-2">
          Ideas KC Flagged
        </p>
        <div className="space-y-1">
          {kcIdeas.map((idea) => (
            <div key={idea.id} className="flex items-center gap-2 rounded-lg px-3 py-2 bg-surface-container-low">
              <span className="text-[9px] font-mono text-primary">#{idea.id}</span>
              <span className="text-xs text-on-surface-variant">{idea.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
