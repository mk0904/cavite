"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import PublicRoute from "@/components/auth/PublicRoute";

export default function SignUpPage() {
  const { user, profile, loginWithGoogle, logout, error, loading } = useAuth();
  const [role, setRole] = useState<"student" | "admin">("student");
  const [step, setStep] = useState<1 | 2>(1);
  const [preferredName, setPreferredName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persistence: Load role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("cavite_role");
    if (savedRole === "student" || savedRole === "admin") {
      setRole(savedRole);
    } else {
      // Default to student if none saved
      localStorage.setItem("cavite_role", "student");
    }
  }, []);

  // Persistence: Save role when it changes
  const handleSetRole = (newRole: "student" | "admin") => {
    setRole(newRole);
    localStorage.setItem("cavite_role", newRole);
  };

  // If user is logged in but has no profile, force step 2
  useEffect(() => {
    if (user && !profile && !loading && step === 1) {
      setStep(2);
      if (user.displayName && !preferredName) {
        setPreferredName(user.displayName);
      }
    }
  }, [user, profile, loading, step, preferredName]);

  const handleGoogleSignIn = async () => {
    if (!role) {
      alert("please select your role first to align your telemetry.");
      return;
    }
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("login failed:", err);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("user session lost. please sign in again.");
      return;
    }
    if (!role) {
      alert("role missing. please go back and select student or admin.");
      setStep(1);
      return;
    }
    if (!preferredName) {
      alert("please enter your name.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Saving profile for:", user.uid, role);
      await setDoc(doc(db, "users", user.uid), {
        name: preferredName,
        role: role,
        email: user.email,
        photoURL: user.photoURL || null,
        onboarded: true,
        createdAt: new Date().toISOString(),
      });
      console.log("Profile saved successfully.");
    } catch (err: any) {
      console.error("error saving profile:", err);
      if (err.code === 'permission-denied') {
        alert("permission denied: please check your firestore rules in the console.");
      } else if (err.code === 'unavailable' || err.message.includes('offline')) {
        alert("connection error: check your internet or firestore status.");
      } else {
        alert(`failed to save profile: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicRoute>
      <main className="flex-grow flex flex-col md:flex-row items-stretch overflow-hidden min-h-screen">
        {/* left side: editorial content / brand identity */}
        <section className="hidden lg:flex w-5/12 bg-gradient-to-br from-[#006064] to-[#007b80] relative flex-col justify-between p-16 text-on-primary">
          <div className="relative z-10">
            <div className="text-3xl font-extrabold tracking-tighter text-on-primary mb-24">
              cavite.
            </div>
            <h1 className="text-6xl font-extrabold font-headline leading-tight tracking-tight mb-8">
               {step === 1 ? (
                 <>architectural <br />opportunity.</>
               ) : (
                 <>almost <br />there.</>
               )}
            </h1>
            <p className="text-xl font-body text-on-primary-container max-w-md leading-relaxed opacity-90">
              {step === 1 
                ? "enter the refined portal for talent placement. precision-engineered for the next generation of industry leaders."
                : "we're configuring your dedicated workspace. just a few final details to align your architectural telemetry."}
            </p>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-4">
                <img
                  className="w-12 h-12 rounded-full border-2 border-primary-container"
                  alt="professional portrait"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaCWfPu3IoeC-BlqI8ULk3rj6z82o-nHBYxCw-PZN0ajMpa2mAsgTUawQVwJ0p9bPaFyz4xBypWTU8FfThVpTD7OG5Vr2s28Iy_wXi4yUFRTPzzculQpy6cG37Qr3LmxBg9dO6AzVQHFsMh5OZG3DulzRjosAl1hfcFA13tj7DhNFZE01QpWQsCcqloZ1yr9uUv_eenmgmev2QJyawDSrvJVBsorvWai7Lq00FX5nfV8DKgHxgc8hKalNjvNyXypSTOXHgJ-e4KL0"
                />
                <img
                  className="w-12 h-12 rounded-full border-2 border-primary-container"
                  alt="business executive"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS31KoxeHiX1fE9Dfmb_4zyfIF3UshKIyCExKFD8gHytT5CNwV6qb_MwYhXE03_BzF36yH09k72RPKYB6XvUruKFIV8VWdU0TBQWZyY0BvHYD1Nblnj-yi1yyMsjR4Hanf_ED8nLDIfIpgagn3PoECwE4zQBK9uyoODPIAUrsBNdhjzxzFmFJi7oNxuPOskxY_62EAjVZ8uKrNJ8HyD-uDMwhcNtd_m9qtpYcXzcfopjfxJJ0JRpgyh52mrRHTD9dcY4gMuHoREjY"
                />
                <img
                  className="w-12 h-12 rounded-full border-2 border-primary-container"
                  alt="creative designer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQwhunopBD1o5H9c0rEyXdXHwa3wPjK9rdfegP53HMySHjiVf7yP2ShguL8FDsseSY6hW3p16SUjIMnX_lv6H6hCAlrwb9cIeSs5du8td_jEohJx5iDUjtD6yUfuL7PPk7vPMtZXwUlah2nIZ5bw-skaSexT0b0YbL6MgzNGjNa7vaDP7NCKMM-dv-SDMDL6Qg1Sr5Ik8JODiCGRZ3kWBtoqHXtSGxRoBpleBS2H4OtoAM2_b9BgvyWjrXvyrYr3TBcG7oyKqD0X0"
                />
              </div>
              <span className="text-sm font-label font-medium text-on-primary-container">
                joined by 2,000+ professionals
              </span>
            </div>
            <div className="text-sm font-label tracking-widest opacity-60">
              cavite placement portal © 2024
            </div>
          </div>
          
          {/* abstract visual motif */}
          <div className="absolute bottom-0 right-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
            <svg className="w-full h-full object-cover" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,500 L500,0 L500,500 Z" fill="white"></path>
            </svg>
          </div>
        </section>
        
        {/* right side: dynamic form canvas */}
        <section className="w-full lg:w-7/12 bg-surface flex flex-col justify-center items-center px-6 md:px-16 py-12 relative">
          <div className="absolute top-12 left-12 lg:hidden">
              <Link href="/" className="text-2xl font-bold tracking-tighter text-brand-teal">cavite.</Link>
          </div>
          
          <div className="max-w-md w-full transition-all duration-500">
            
            {step === 1 ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                <div className="mb-10 text-center lg:text-left">
                  <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-2">create account</h2>
                  <p className="text-on-surface-variant font-body">select your path to begin the journey.</p>
                </div>
                
                {/* role selection */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <button 
                    disabled={loading}
                    onClick={() => handleSetRole("student")}
                    className={`flex flex-col items-start p-5 rounded-[2rem] transition-all duration-300 border shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-teal ${role === "student" ? "border-brand-teal bg-brand-teal/5 scale-[0.98]" : "border-outline-variant/30 bg-surface-container-lowest hover:border-brand-teal/40 hover:bg-surface-container-low"}`}
                  >
                    <span className={`material-symbols-outlined mb-3 transition-colors ${role === "student" ? "text-brand-teal" : "text-outline-variant"}`}>school</span>
                    <span className="font-bold text-on-surface text-sm block">i'm a student</span>
                    <span className="text-xs text-on-surface-variant mt-1">seeking opportunities</span>
                  </button>
                  
                  <button 
                    disabled={loading}
                    onClick={() => handleSetRole("admin")}
                    className={`flex flex-col items-start p-5 rounded-[2rem] transition-all duration-300 border shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-teal ${role === "admin" ? "border-brand-teal bg-brand-teal/5 scale-[0.98]" : "border-outline-variant/30 bg-surface-container-lowest hover:border-brand-teal/40 hover:bg-surface-container-low"}`}
                  >
                    <span className={`material-symbols-outlined mb-3 transition-colors ${role === "admin" ? "text-brand-teal" : "text-outline-variant"}`}>admin_panel_settings</span>
                    <span className="font-bold text-on-surface text-sm block">i'm an admin</span>
                    <span className="text-xs text-on-surface-variant mt-1">managing talent</span>
                  </button>
                </div>
                
                <div className="space-y-6 flex flex-col items-center">
                  <button 
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full bg-white border border-outline-variant/30 text-on-surface font-bold py-4 rounded-full hover:bg-surface-container-low hover:shadow-md transition-all flex justify-center items-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 group focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1 disabled:opacity-50" 
                    type="button"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    )}
                    <span>continue with google</span>
                  </button>

                  {error && (
                    <div className="w-full p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-medium text-center animate-in fade-in zoom-in-95">
                      {error}
                    </div>
                  )}
                  
                  <div className="text-center mt-8">
                    <p className="font-body text-sm text-on-surface-variant">
                      already have an account? 
                      <Link className="text-brand-teal font-bold ml-1 hover:underline underline-offset-4" href="/login">log in</Link>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-8 duration-700 fill-mode-both">
                <div className="mb-10 text-center lg:text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">almost there</h2>
                    <span className="px-3 py-1 bg-brand-teal/10 text-brand-teal text-[10px] font-bold rounded-full tracking-widest uppercase">{role} profile</span>
                  </div>
                  <p className="text-on-surface-variant font-body">logged in as <span className="text-brand-teal font-bold">{user?.email}</span>. let's finalize your workspace.</p>
                </div>
                
                <form onSubmit={handleCompleteProfile} className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-label text-xs font-semibold text-on-surface-variant ml-1">preferred name</label>
                    <input 
                      required 
                      value={preferredName}
                      onChange={(e) => setPreferredName(e.target.value)}
                      className="w-full px-5 py-4 bg-surface-container-low border border-transparent rounded-full focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all font-body text-on-surface placeholder:text-outline-variant" 
                      placeholder="what should we call you?" 
                      type="text" 
                    />
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <input required className="w-5 h-5 rounded border-outline-variant text-brand-teal focus:ring-brand-teal bg-surface-container-low cursor-pointer" type="checkbox" />
                    <span className="text-xs font-body text-on-surface-variant text-left">i agree to the <a className="text-brand-teal font-semibold hover:underline" href="#">terms of service</a> and <a className="text-brand-teal font-semibold hover:underline" href="#">privacy policy</a>.</span>
                  </div>
                  
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-br from-[#006064] to-[#007b80] text-white font-bold py-4 rounded-full shadow-lg shadow-brand-teal/20 hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-4 focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1 disabled:opacity-50" 
                    type="submit"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>complete & enter portal</span>
                        <span className="material-symbols-outlined text-xl">login</span>
                      </>
                    )}
                  </button>

                  <div className="text-center mt-6">
                    <button 
                      type="button"
                      onClick={logout}
                      className="font-body text-sm text-on-surface-variant hover:text-brand-teal transition-colors"
                    >
                      not you? <span className="font-bold underline">switch account</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
            
          </div>
        </section>
      </main>
    </PublicRoute>
  );
}
