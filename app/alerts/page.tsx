"use client";

export default function Alerts() {
  return (
    <main className="pt-20 px-4 w-full pb-32">
      {/* Welcome Section (Editorial Hero) */}
      <section className="mb-8 mt-4 max-w-2xl">
        <h2 className="text-4xl font-black tracking-tight leading-none mb-2 text-on-surface">
          Community <span className="text-primary">Heartbeat</span>
        </h2>
        <p className="text-on-surface-variant font-medium">Connect, support, and grow with your neighbors.</p>
      </section>

      {/* Category Horizontal Scroll */}
      <nav className="flex gap-3 overflow-x-auto hide-scrollbar mb-8 -mx-4 px-4 max-w-2xl">
        <button className="flex-none bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-sm shadow-sm active:scale-95 transition-transform">All Stories</button>
        <button className="flex-none bg-zinc-100 text-on-surface-variant border border-zinc-200 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-yellow-50 transition-colors">Safety Tips</button>
        <button className="flex-none bg-zinc-100 text-on-surface-variant border border-zinc-200 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-yellow-50 transition-colors">Load-shedding</button>
        <button className="flex-none bg-zinc-100 text-on-surface-variant border border-zinc-200 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-yellow-50 transition-colors">Local Gigs</button>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          {/* Featured Alert (Accent Card) */}
          <div className="p-6 rounded-[32px] bg-secondary text-white relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="bg-primary p-3 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              </div>
              <div>
                <h3 className="font-bold text-primary text-xl">Stage 4 Coordination</h3>
                <p className="text-white/80 text-sm mt-1 leading-relaxed">Schedule updated for Block A & C. Join the thread to coordinate shared generator time.</p>
                <button className="mt-4 text-primary font-bold text-sm flex items-center gap-2 group/btn">
                  View Schedule 
                  <span className="material-symbols-outlined text-sm transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Safety Tip Post */}
          <article className="bg-yellow-50 rounded-[32px] p-6 relative overflow-hidden border border-primary/20">
            <div className="absolute right-0 top-0 w-40 h-40 bg-primary/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-sm">Community Watch</h4>
                  <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Safety Tips • 5h ago</span>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <h3 className="font-black text-xl mb-2 text-on-surface">Streetlight Outage on 14th Ave</h3>
                  <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                    Please be careful when walking tonight. We have reported it, but it is still dark. Use the buddy system!
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-300"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-400"></div>
                </div>
                <span className="text-xs text-on-surface-variant font-bold">Sizwe and 18 others commented</span>
              </div>
            </div>
          </article>
        </div>

        {/* Feed Section */}
        <div className="space-y-6">
          {/* Success Story Post */}
          <article className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-zinc-100">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img alt="Lerato Mokoena" className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30" src="https://i.pravatar.cc/150?u=lerato" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-on-surface text-sm">Lerato Mokoena</h4>
                    <span className="text-[11px] text-on-surface-variant font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-yellow-600" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Success Story • 2h ago
                    </span>
                  </div>
                </div>
                <button className="text-on-surface-variant hover:bg-zinc-50 p-1 rounded-full">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
              <h3 className="font-black text-xl mb-3 leading-tight">Opened my 3rd Spaza shop!</h3>
              <p className="text-on-surface-variant text-sm font-medium leading-relaxed mb-4">
                Could not have done it without the KasiLink community. Big thanks to those who helped with the interior painting last week! Expansion is real.
              </p>
              <img alt="Community Spaza shop" className="w-full h-56 object-cover rounded-3xl mb-4" src="https://picsum.photos/seed/shop/600/400" referrerPolicy="no-referrer" />
              <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-yellow-600 transition-colors">
                    <span className="material-symbols-outlined text-xl">favorite</span>
                    <span className="text-xs font-bold">124</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-yellow-600 transition-colors">
                    <span className="material-symbols-outlined text-xl">chat_bubble</span>
                    <span className="text-xs font-bold">42</span>
                  </button>
                </div>
                <button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors font-bold text-xs">
                  <span className="material-symbols-outlined text-sm">share</span>
                  WhatsApp
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

