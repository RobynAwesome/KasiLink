export function TopBar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-none border-b border-zinc-100 dark:border-zinc-800 md:hidden">
      <div className="flex justify-between items-center px-4 h-16 w-full max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">location_on</span>
          <h1 className="text-xl font-black text-yellow-600 dark:text-yellow-400 tracking-tight font-headline italic">KasiLink</h1>
        </div>
        <button className="hover:bg-yellow-50 dark:hover:bg-zinc-800 transition-colors p-2 rounded-full active:scale-95 duration-150">
          <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400">notifications</span>
        </button>
      </div>
    </header>
  );
}
