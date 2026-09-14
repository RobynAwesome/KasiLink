"use client";

import { motion } from 'motion/react';
import KCCommandStrip from '@/components/KCCommandStrip';

export default function Home() {
  return (
    <main className="mt-20 px-4 space-y-8 w-full pb-32">
      {/* Load-shedding Status Widget */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-secondary p-6 text-on-secondary shadow-lg"
      >
        <div className="relative z-10 flex justify-between items-center px-4">
          <div>
            <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-1 block">System Status</span>
            <h2 className="text-2xl font-black tracking-tight mb-0.5">Stage 2 Active</h2>
            <p className="text-zinc-400 text-xs font-medium italic">Next cut in 2h 14m</p>
          </div>
          <div className="bg-primary p-4 rounded-full shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-on-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary opacity-5 rounded-full blur-3xl"></div>
      </motion.section>

      {/* Safety Alerts Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-on-surface">Nearby Safety Alerts</h3>
          <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full cursor-pointer">View Area Map</span>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 snap-x">
          <div className="min-w-[300px] snap-center bg-white p-5 rounded-3xl shadow-md border border-outline flex items-center gap-4">
            <div className="bg-error/10 text-error p-3 rounded-full flex-shrink-0">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center pr-4">
                <span className="text-[9px] font-black text-error uppercase">High Alert</span>
                <span className="text-[9px] text-zinc-400">12m ago</span>
              </div>
              <p className="text-sm font-bold text-on-surface truncate">Water Outage Reported</p>
              <p className="text-[11px] text-on-surface-variant truncate">Maintenance on Section 4 main line.</p>
            </div>
          </div>
          <div className="min-w-[300px] snap-center bg-white p-5 rounded-3xl shadow-md border border-outline flex items-center gap-4">
            <div className="bg-success/10 text-success p-3 rounded-full flex-shrink-0">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center pr-4">
                <span className="text-[9px] font-black text-success uppercase">Community</span>
                <span className="text-[9px] text-zinc-400">45m ago</span>
              </div>
              <p className="text-sm font-bold text-on-surface truncate">SAPS Patrol Active</p>
              <p className="text-[11px] text-on-surface-variant truncate">Increased visibility around taxi rank.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Kopano Context & Agent Command Strip */}
      <section className="px-1">
        <KCCommandStrip />
      </section>

      {/* Available Gigs Nearby */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-on-surface px-2">Available Gigs Nearby</h3>
        <div className="grid grid-cols-1 gap-4">
          <GigCard 
            title="Express Exterior Wash" 
            price="R120" 
            distance="0.8 km" 
            rating="4.9" 
            image="https://picsum.photos/seed/carwash/200"
            verified
          />
          <GigCard 
            title="Maths Grade 10-12" 
            price="R200/hr" 
            distance="1.2 km" 
            rating="5.0" 
            image="https://picsum.photos/seed/tutor/200"
          />
        </div>
      </section>

      {/* Success Story Card */}
      <section className="pb-12">
        <div className="relative bg-zinc-900 rounded-[40px] overflow-hidden min-h-[260px] flex items-end shadow-xl">
          <img 
            alt="Success Story Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale mix-blend-overlay" 
            src="https://picsum.photos/seed/bakery/800/600"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent"></div>
          <div className="relative z-10 p-8 text-on-secondary w-full">
            <span className="bg-primary text-on-primary text-[10px] font-black uppercase px-3 py-1 rounded-full mb-3 inline-block">Local Hero</span>
            <h3 className="text-2xl font-black leading-tight">How Mam’ Thandi built her bakery using Gigs</h3>
            <p className="text-sm text-zinc-300 mt-2 font-medium italic line-clamp-2">“I started with one cake order on KasiLink. Now I employ three people.”</p>
            <button className="mt-5 flex items-center justify-center gap-2 text-[11px] font-black text-on-primary bg-primary w-full py-3 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform">
              Read Story <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* FAB */}
      <button className="fixed right-6 bottom-28 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all z-40 ring-4 ring-white shadow-primary/40">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </main>
  );
}

interface GigCardProps {
  title: string;
  price: string;
  distance: string;
  rating: string;
  image: string;
  verified?: boolean;
}

function GigCard({ title, price, distance, rating, image, verified }: GigCardProps) {
  return (
    <div className="bg-surface-variant p-4 rounded-3xl flex items-center gap-4 group transition-all active:scale-[0.98] border border-transparent hover:border-primary/30">
      <div className="relative">
        <img 
          alt={title} 
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" 
          src={image}
          referrerPolicy="no-referrer"
        />
        {verified && (
          <div className="absolute -bottom-1 -right-1 bg-success text-white text-[8px] font-black p-1 rounded-full shadow-sm">
            <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
          </div>
        )}
      </div>
      <div className="flex-1 pr-6">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-on-surface text-sm">{title}</h4>
          <span className="font-black text-yellow-600 text-sm">{price}</span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
            <span className="material-symbols-outlined text-[12px]">distance</span> {distance}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600">
            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {rating}
          </span>
        </div>
      </div>
    </div>
  );
}
