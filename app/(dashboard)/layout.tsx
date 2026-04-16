"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-surface text-on-surface selection:bg-brand-teal/20">
        {/* immersive architectural background */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-brand-teal/10 rounded-full blur-[120px] animate-pulse transition-all duration-1000"></div>
          <div className="absolute bottom-[5%] left-[-10%] w-[50vw] h-[50vw] bg-secondary-container/15 rounded-full blur-[150px]"></div>
          <div className="absolute top-[30%] left-[20%] w-[20vw] h-[20vw] bg-tertiary-fixed/5 rounded-full blur-[100px]"></div>
        </div>

        {/* floating navigation pill */}
        <div className="fixed top-6 left-0 right-0 z-50 mx-auto max-w-5xl px-4 w-full">
          <nav className="flex justify-between items-center px-6 py-2.5 w-full bg-white/30 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_rgba(0,123,128,0.08)] border border-white/40 font-body">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-black tracking-tighter text-brand-teal pr-6 border-r border-outline-variant/30">
                cavite.
              </Link>
              <div className="hidden md:flex gap-6 items-center">
                <Link 
                  href="/dashboard" 
                  className="text-xs font-bold tracking-widest text-on-surface hover:text-brand-teal transition-colors uppercase py-1 border-b-2 border-brand-teal"
                >
                  nexus
                </Link>
                <Link 
                  href="/resumes" 
                  className="text-xs font-bold tracking-widest text-on-surface/50 hover:text-brand-teal transition-colors uppercase"
                >
                  resumes
                </Link>
                <Link 
                  href="/jobs" 
                  className="text-xs font-bold tracking-widest text-on-surface/50 hover:text-brand-teal transition-colors uppercase"
                >
                  jobs
                </Link>
                <Link 
                  href="/applications" 
                  className="text-xs font-bold tracking-widest text-on-surface/50 hover:text-brand-teal transition-colors uppercase"
                >
                  apps
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-[10px] font-black tracking-tighter text-on-surface leading-none mb-0.5">{profile?.name || "architect"}</span>
                <span className="text-[8px] font-bold tracking-[0.2em] text-brand-teal uppercase opacity-70">{profile?.role || "user"}</span>
              </div>
              
              <div className="relative group">
                <button className="w-10 h-10 rounded-full overflow-hidden border border-white/60 shadow-inner bg-white/40 flex items-center justify-center group-hover:border-brand-teal transition-all">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-brand-teal/60 text-xl">person</span>
                  )}
                </button>
                
                {/* floating profile dropdown */}
                <div className="absolute right-0 top-full mt-4 w-56 glass-panel border border-white/40 shadow-2xl rounded-3xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="pb-3 mb-3 border-b border-outline-variant/20">
                    <p className="text-xs font-black text-on-surface truncate">{profile?.name}</p>
                    <p className="text-[9px] text-on-surface-variant font-medium mt-0.5">{profile?.email}</p>
                  </div>
                  <nav className="space-y-1">
                    <button className="w-full text-left px-3 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase text-on-surface-variant hover:bg-brand-teal/5 hover:text-brand-teal transition-all flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">settings</span> settings
                    </button>
                    <button 
                      onClick={() => logout()}
                      className="w-full text-left px-3 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">logout</span> logout
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* main content (floatable panels) */}
        <main className="relative z-10 pt-28 px-4 md:px-8 max-w-7xl mx-auto w-full flex-grow flex flex-col">
          {children}
        </main>

        <footer className="relative z-10 py-10 text-center">
            <p className="text-[9px] font-bold tracking-[0.4em] text-on-surface-variant/30 uppercase">cavite architectural placement portal © 2024</p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
