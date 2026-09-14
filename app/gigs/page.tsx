"use client";

export default function Gigs() {
  return (
    <main className="pt-20 px-4 space-y-6 w-full pb-32">
      {/* Editorial Header Section */}
      <section className="space-y-2 max-w-2xl">
        <h1 className="font-headline text-4xl font-black tracking-tight text-on-surface leading-[1.1]">Find your next hustle.</h1>
        <p className="text-on-surface-variant font-medium text-lg leading-relaxed">Connecting local talent with immediate township opportunities.</p>
      </section>

      {/* Search & Filter Cluster */}
      <section className="space-y-4 max-w-2xl">
        <div className="flex items-center gap-3 bg-zinc-100 rounded-full px-5 py-3.5 border border-zinc-200/50">
          <span className="material-symbols-outlined text-zinc-400">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 w-full font-medium text-on-surface placeholder:text-zinc-400 p-0" 
            placeholder="Search for gigs..." 
            type="text"
          />
          <span className="material-symbols-outlined text-zinc-400">tune</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar flex-1">
            <button className="whitespace-nowrap px-6 py-2 bg-primary text-on-primary font-bold rounded-full active:scale-95 transition-all shadow-sm">All Gigs</button>
            <button className="whitespace-nowrap px-6 py-2 bg-white text-on-surface-variant font-semibold rounded-full border border-zinc-200 hover:bg-zinc-50 transition-colors">Car Wash</button>
            <button className="whitespace-nowrap px-6 py-2 bg-white text-on-surface-variant font-semibold rounded-full border border-zinc-200 hover:bg-zinc-50 transition-colors">Tutoring</button>
            <button className="whitespace-nowrap px-6 py-2 bg-white text-on-surface-variant font-semibold rounded-full border border-zinc-200 hover:bg-zinc-50 transition-colors">Cleaning</button>
          </div>
          <div className="flex items-center bg-zinc-100 p-1 rounded-full ml-2 shrink-0">
            <button className="p-2 rounded-full bg-white shadow-sm"><span className="material-symbols-outlined text-base">grid_view</span></button>
            <button className="p-2 rounded-full"><span className="material-symbols-outlined text-base text-zinc-400">map</span></button>
          </div>
        </div>
      </section>

      {/* Gig Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <GigDetailCard 
            title="Weekend Car Detailing"
            location="Soweto, Zone 4"
            price="R450"
            period="Per Day"
            description="Looking for an experienced detailer for 3 luxury vehicles. Must have own high-quality wax and interior cleaners."
            image="https://picsum.photos/seed/detailing/600/400"
            verified
          />
        </div>
        
        <GigSmallCard 
          title="Grade 11 Math Tutor"
          price="R150/hr"
          schedule="Tuesdays & Thursdays"
          description="Help with trigonometry and calculus basics."
          image="https://picsum.photos/seed/math/200"
        />

        <GigSmallCard 
          title="Home Cleaning Service"
          price="R250"
          schedule="Flexible"
          description="Deep cleaning for a 3-bedroom house."
          image="https://picsum.photos/seed/clean/200"
        />

        <div className="md:col-span-2">
          <GigDetailCard 
            title="Post-Event Deep Clean"
            location="Alexandra, Ext 7"
            price="R300"
            period="Fixed"
            description="Urgent cleaning needed for a community hall after a wedding event."
            image="https://picsum.photos/seed/cleaning/600/400"
            urgent
          />
        </div>
      </div>
    </main>
  );
}

interface GigDetailCardProps {
  title: string;
  location: string;
  price: string;
  period: string;
  description: string;
  image: string;
  verified?: boolean;
  urgent?: boolean;
}

function GigDetailCard({ title, location, price, period, description, image, verified, urgent }: GigDetailCardProps) {
  return (
    <article className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-200/50">
      {urgent && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-error text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">Urgent</div>
        </div>
      )}
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" 
          src={image}
          referrerPolicy="no-referrer"
        />
        {verified && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-on-surface px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-zinc-100 shadow-sm">
            <span className="material-symbols-outlined text-sm text-success" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            Verified Poster
          </div>
        )}
      </div>
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-headline text-xl font-extrabold text-on-surface leading-tight">{title}</h3>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-sm font-medium">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {location}
            </div>
          </div>
          <div className="text-right">
            <span className="block font-black text-2xl text-on-surface leading-none">{price}</span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">{period}</span>
          </div>
        </div>
        <p className="text-on-surface-variant line-clamp-2 text-sm leading-relaxed">{description}</p>
        <div className="flex items-center justify-between pt-2">
          <div className="flex -space-x-2">
            <img alt="User avatar" className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/150?u=1" referrerPolicy="no-referrer" />
            <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold border-2 border-white">+12</div>
          </div>
          <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-black text-sm active:scale-95 transition-all shadow-md">View Gig</button>
        </div>
      </div>
    </article>
  );
}

interface GigSmallCardProps {
  title: string;
  price: string;
  schedule: string;
  description: string;
  image: string;
}

function GigSmallCard({ title, price, schedule, description, image }: GigSmallCardProps) {
  return (
    <article className="bg-white rounded-3xl p-4 shadow-sm border border-zinc-200/50 flex gap-4">
      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
        <img alt={title} className="w-full h-full object-cover" src={image} referrerPolicy="no-referrer" />
      </div>
      <div className="flex-1 space-y-2 py-1">
        <div className="flex justify-between items-start">
          <h3 className="font-headline font-extrabold text-on-surface leading-tight text-lg">{title}</h3>
          <span className="font-bold text-on-surface">{price}</span>
        </div>
        <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-semibold">
          <span className="material-symbols-outlined text-xs">schedule</span>
          {schedule}
        </div>
        <p className="text-on-surface-variant text-xs line-clamp-1">{description}</p>
        <div className="flex justify-end">
          <button className="text-yellow-700 font-black text-xs hover:underline decoration-2 underline-offset-4">VIEW GIG</button>
        </div>
      </div>
    </article>
  );
}

