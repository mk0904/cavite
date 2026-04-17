"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  DashboardThemeProvider,
  useDashboardTheme,
} from "@/context/DashboardThemeContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

/** Resume studio sidebar: query ?section= matches editor sections (same as `SectionType` + general/socials). */
const RESUME_NAV_SECTION: Record<string, string> = {
  basics: "general",
  "social links": "socials",
  education: "education",
  experience: "experience",
  certificates: "certificates",
  projects: "projects",
  skills: "skills",
  leadership: "leadership",
};

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth();
  const { theme, toggleTheme } = useDashboardTheme();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAdmin = profile?.role === "admin";
  const isDark = theme === "dark";

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
    <div
      className={`flex h-screen overflow-hidden gap-3 p-3 md:p-4 transition-colors duration-500 ${
        isDark ? "dark bg-[#050708] text-on-surface" : "bg-[#e8edf3] text-on-surface"
      }`}
    >
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-[-15%] right-[-8%] w-[45vw] h-[45vw] rounded-full blur-[100px] transition-opacity duration-500 ${
            isDark
              ? "bg-[#007b80]/25 opacity-90"
              : "bg-brand-teal/20 opacity-70"
          }`}
        />
        <div
          className={`absolute bottom-[-5%] left-[-15%] w-[55vw] h-[55vw] rounded-full blur-[120px] transition-opacity duration-500 ${
            isDark ? "bg-blue-600/10 opacity-80" : "bg-sky-300/25 opacity-50"
          }`}
        />
      </div>

      <aside
        className={`relative z-50 flex min-h-0 w-56 shrink-0 flex-col overflow-hidden rounded-[1.75rem] border shadow-2xl backdrop-blur-2xl transition-colors duration-500 ${
          isDark
            ? "border-white/[0.08] bg-white/[0.04] shadow-black/40"
            : "border-white/70 bg-white/55 shadow-slate-300/30"
        }`}
      >
        <div className="p-6 pb-8">
          {isResumeEditor ? (
            <Link
              href="/resumes"
              className={`group flex items-center gap-3 transition-colors ${
                isDark
                  ? "text-white/45 hover:text-brand-teal"
                  : "text-slate-500 hover:text-brand-teal"
              }`}
            >
              <span className="material-symbols-outlined flex h-7 w-7 shrink-0 items-center justify-center overflow-visible text-[20px] leading-none transition-transform group-hover:-translate-x-0.5">
                arrow_back
              </span>
              <span className="text-[10px] font-black uppercase leading-none tracking-[0.2em]">
                exit studio
              </span>
            </Link>
          ) : (
            <Link
              href="/"
              className="group flex items-center gap-2.5 text-xl font-bold tracking-tighter text-brand-teal"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal to-[#005a5e] text-sm text-white shadow-[0_0_20px_rgba(0,123,128,0.45)] transition-transform group-hover:rotate-6">
                c
              </div>
              <span className="transition-transform group-hover:translate-x-0.5">
                cavite
                <span
                  className={`font-bold ${
                    isDark ? "text-white/80" : "text-slate-700"
                  }`}
                >
                  .in
                </span>
              </span>
            </Link>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 pt-1.5">
          {activeNavItems.map((item) => {
            const resumeSection = isResumeEditor
              ? searchParams.get("section") || "general"
              : null;
            const itemSection = isResumeEditor
              ? RESUME_NAV_SECTION[item.label]
              : null;
            const isActive = isResumeEditor
              ? itemSection !== undefined && resumeSection === itemSection
              : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-[2.75rem] items-center gap-3 overflow-visible rounded-2xl px-3 py-2.5 transition-all ${
                  isActive
                    ? isDark
                      ? "bg-brand-teal/20 text-brand-teal shadow-[0_0_24px_rgba(0,123,128,0.35)] ring-1 ring-brand-teal/30"
                      : "bg-white/90 text-brand-teal shadow-[0_8px_28px_rgba(0,123,128,0.18)] ring-1 ring-brand-teal/20"
                    : isDark
                      ? "text-white/40 hover:bg-white/[0.06] hover:text-white/90"
                      : "text-slate-500 hover:bg-white/50 hover:text-slate-900"
                }`}
              >
                <span
                  className={`material-symbols-outlined flex h-7 w-7 shrink-0 items-center justify-center overflow-visible text-[22px] leading-none ${
                    isActive ? "text-brand-teal" : ""
                  }`}
                  aria-hidden
                >
                  {item.icon}
                </span>
                <span className="min-w-0 self-center text-[12px] font-bold lowercase leading-none tracking-wide">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          className={`border-t p-5 ${
            isDark ? "border-white/[0.06] bg-black/20" : "border-slate-200/60 bg-white/30"
          }`}
        >
          <div className="mb-4 flex items-center justify-between px-0.5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div
                className={`h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 ${
                  isDark ? "border-white/15" : "border-white shadow-md"
                }`}
              >
                {profile?.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-brand-teal/15 text-brand-teal/50">
                    <span className="material-symbols-outlined flex h-6 w-6 items-center justify-center overflow-visible text-[20px] leading-none">
                      person
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p
                  className={`truncate text-[9px] font-bold lowercase tracking-tight ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {profile?.name?.split(" ")[0] || "user"}
                </p>
                <p className="text-[7px] font-semibold lowercase tracking-wider text-brand-teal/70">
                  {profile?.role || "analyst"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${
                isDark
                  ? "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  : "border-slate-200/80 bg-white/80 text-slate-600 hover:bg-white"
              }`}
              aria-label={isDark ? "switch to light theme" : "switch to dark theme"}
            >
              <span className="material-symbols-outlined flex h-7 w-7 items-center justify-center overflow-visible text-[20px] leading-none">
                {isDark ? "light_mode" : "dark_mode"}
              </span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className={`flex flex-1 items-center justify-center rounded-xl border py-2 transition-all ${
                isDark
                  ? "border-transparent bg-white/[0.04] text-white/35 hover:border-white/10 hover:text-brand-teal"
                  : "border-slate-200/50 bg-white/50 text-slate-400 hover:text-brand-teal"
              }`}
              aria-label="settings"
            >
              <span className="material-symbols-outlined flex h-7 w-7 items-center justify-center overflow-visible text-[20px] leading-none">
                settings
              </span>
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className={`flex flex-1 items-center justify-center rounded-xl border py-2 transition-all ${
                isDark
                  ? "border-transparent bg-white/[0.04] text-white/35 hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-400"
                  : "border-slate-200/50 bg-white/50 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <span className="material-symbols-outlined flex h-7 w-7 items-center justify-center overflow-visible text-[20px] leading-none">
                logout
              </span>
            </button>
          </div>

          <p
            className={`mt-4 text-center text-[6px] font-bold lowercase tracking-widest ${
              isDark ? "text-white/25" : "text-slate-400"
            }`}
          >
            v2.0.26 structural
          </p>
        </div>
      </aside>

      <main className="relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
        <div className="mx-auto min-h-full w-full max-w-[1400px] px-2 pb-8 pt-1 md:px-4">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardThemeProvider>
        <DashboardLayoutInner>{children}</DashboardLayoutInner>
      </DashboardThemeProvider>
    </ProtectedRoute>
  );
}
