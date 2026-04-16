import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | Cavite Placement Portal",
  description: "Product management and telemetry operations.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafa] text-on-surface">
      {/* background architectural elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-48 w-[600px] h-[600px] bg-secondary-container/10 rounded-full blur-[120px]"></div>
      </div>

      {/* top navigation bar */}
      <header className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_0_rgba(0,123,128,0.1)]">
        <div className="flex justify-between items-center w-full px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-black tracking-tighter text-brand-teal font-headline hover:opacity-80 transition-opacity">
              cavite.
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-transparent focus-within:border-brand-teal focus-within:ring-1 focus-within:ring-brand-teal focus-within:ring-offset-1 transition-all">
              <span className="material-symbols-outlined text-outline text-sm">search</span>
              <input 
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-label ml-2 w-64 placeholder:text-outline" 
                placeholder="search opportunities..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-white/40 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1 text-brand-teal">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="p-2 rounded-full hover:bg-white/40 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1 text-brand-teal">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* sidebar navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 z-40 border-r border-white/20 bg-white/40 backdrop-blur-2xl shadow-2xl shadow-brand-teal/5 flex flex-col pt-24 pb-6 px-4 hidden lg:flex">
        <div className="mb-8 px-4">
          <h2 className="font-headline text-xl font-bold text-brand-teal">cavite portal</h2>
          <p className="font-label text-xs text-on-surface-variant opacity-70 tracking-widest mt-1">student access</p>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 bg-brand-teal/10 text-brand-teal border-r-2 border-brand-teal font-medium focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label text-sm">dashboard</span>
          </Link>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-on-surface-variant hover:bg-white/40 hover:translate-x-1 focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1" href="#">
            <span className="material-symbols-outlined">description</span>
            <span className="font-label text-sm">resumes</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-on-surface-variant hover:bg-white/40 hover:translate-x-1 focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1" href="#">
            <span className="material-symbols-outlined">work</span>
            <span className="font-label text-sm">jobs</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-on-surface-variant hover:bg-white/40 hover:translate-x-1 focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1" href="#">
            <span className="material-symbols-outlined">assignment_turned_in</span>
            <span className="font-label text-sm">applications</span>
          </a>
        </nav>
        
        <div className="mt-auto flex flex-col gap-1">
          <button className="mb-4 mx-2 py-3 px-4 bg-brand-teal text-white rounded-full font-headline font-bold text-sm shadow-lg shadow-brand-teal/20 hover:scale-[1.02] active:scale-95 transition-all focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1">
            new application
          </button>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-on-surface-variant hover:bg-white/40 focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label text-sm">settings</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-on-surface-variant hover:bg-white/40 focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1" href="#">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label text-sm">logout</span>
          </a>
        </div>
      </aside>

      {/* main content wrapper */}
      <div className="lg:ml-64 pt-24 min-h-screen px-6 lg:px-8 pb-12 relative z-10 flex-1 flex flex-col">
          {children}
      </div>
    </div>
  );
}
