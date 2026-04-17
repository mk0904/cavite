"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, logout } = useAuth();
  const pathname = usePathname();
  const isAdmin = profile?.role === "admin";

  const isResumeEditor = pathname.startsWith("/resumes/") && pathname !== "/resumes";
  const resumeId = isResumeEditor ? pathname.split("/").pop() : null;

  const defaultNavItems = [
    { label: "dashboard", href: "/dashboard", icon: "grid_view" },
    { label: "resumes", href: "/resumes", icon: "description" },
    { label: "jobs", href: "/jobs", icon: "work" },
    { label: "applications", href: "/applications", icon: "send" },
    { label: "verification", href: "/onboarding", icon: "verified" },
  ];

  const resumeNavItems = [
    { label: "basics", href: `/resumes/${resumeId}?section=general`, icon: "person" },
    { label: "social links", href: `/resumes/${resumeId}?section=socials`, icon: "link" },
    { label: "education", href: `/resumes/${resumeId}?section=education`, icon: "school" },
    { label: "experience", href: `/resumes/${resumeId}?section=experience`, icon: "history" },
    { label: "certificates", href: `/resumes/${resumeId}?section=certificates`, icon: "verified" },
    { label: "projects", href: `/resumes/${resumeId}?section=projects`, icon: "architecture" },
    { label: "skills", href: `/resumes/${resumeId}?section=skills`, icon: "analytics" },
    { label: "leadership", href: `/resumes/${resumeId}?section=leadership`, icon: "groups" },
  ];

  if (isAdmin && !isResumeEditor) {
    defaultNavItems.push({ label: "users", href: "/admin/users", icon: "group" });
  }

  const activeNavItems = isResumeEditor ? resumeNavItems : defaultNavItems;

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-surface text-on-surface selection:bg-brand-teal/20 font-body gap-0">
        
        {/* Immersive technical background (Persistent across pages) */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-brand-teal/[0.03] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[5%] left-[-10%] w-[50vw] h-[50vw] bg-secondary-container/[0.02] rounded-full blur-[150px]"></div>
        </div>

        {/* 1. Floating 'Glass Capsule' Sidebar */}
        <aside className="w-56 bg-white/20 backdrop-blur-3xl border border-white rounded-[2.5rem] flex flex-col z-50 relative shadow-2xl overflow-hidden shrink-0 h-full">
          
          {/* Minimal Branding / Nexus Control */}
          <div className="p-8 pb-10">
            {isResumeEditor ? (
               <Link href="/resumes" className="flex items-center gap-3 text-on-surface-variant/40 hover:text-brand-teal transition-all group">
                  <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-all">arrow_back</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Studio</span>
               </Link>
            ) : (
               <Link href="/" className="text-xl font-bold tracking-tighter text-brand-teal flex items-center gap-2.5 group">
                 <div className="w-7 h-7 rounded-lg bg-brand-teal flex items-center justify-center text-white text-xs group-hover:rotate-12 transition-all">c</div>
                 <span className="group-hover:translate-x-0.5 transition-all lowercase tracking-tighter">cavite<span className="opacity-80 text-on-surface font-bold">.in</span></span>
               </Link>
            )}
          </div>

          {/* Slim Nav Links */}
          <nav className="flex-1 px-4 space-y-1">
            {activeNavItems.map((item) => {
              // Handle active state for resume editor (via query params)
              const isActive = isResumeEditor 
                ? pathname + (window.location.search || "") === item.href || (item.label === 'basics' && !window.location.search)
                : pathname === item.href;

              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center gap-3 px-2.5 py-2 rounded-xl transition-all group ${
                    isActive 
                    ? 'bg-brand-teal/10 text-brand-teal' 
                    : 'text-on-surface-variant/40 hover:text-on-surface hover:bg-white/10'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] transition-all ${isActive ? 'text-brand-teal' : 'group-hover:text-on-surface'}`}>
                    {item.icon}
                  </span>
                  <span className="text-[12px] font-bold lowercase tracking-wider">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Flat Pro Footer */}
          <div className="p-6 border-t border-white/10 bg-white/5">
            <div className="flex items-center justify-between mb-4 px-1">
               <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-full border border-white/60 overflow-hidden shrink-0 shadow-sm">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-on-surface/5 flex items-center justify-center text-brand-teal/40">
                         <span className="material-symbols-outlined text-base">person</span>
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                     <p className="text-[9px] font-bold text-on-surface truncate lowercase tracking-tight">{profile?.name?.split(" ")[0] || "User"}</p>
                     <p className="text-[7px] font-semibold text-brand-teal lowercase tracking-wider opacity-40 leading-none mt-0.5">{profile?.role || "analyst"}</p>
                  </div>
               </div>
            </div>
            
            <div className="flex gap-1.5">
               <button className="flex-1 flex items-center justify-center py-2 rounded-xl bg-white/5 hover:bg-white/10 text-on-surface-variant/30 hover:text-brand-teal transition-all border border-transparent hover:border-white/10">
                 <span className="material-symbols-outlined text-[16px]">settings</span>
               </button>
               <button 
                 onClick={() => logout()}
                 className="flex-1 flex items-center justify-center py-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-on-surface-variant/30 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
               >
                 <span className="material-symbols-outlined text-[16px]">logout</span>
               </button>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center">
               <span className="text-[6px] font-bold lowercase tracking-widest text-on-surface-variant/20 italic">v2.0.26 structural</span>
            </div>
          </div>
        </aside>

        {/* 2. Main Content Perspective */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative z-10 scroll-smooth scrollbar-hide">
          <div className="max-w-6xl mx-auto w-full min-h-full flex flex-col pt-2">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
