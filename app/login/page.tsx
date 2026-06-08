"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, GraduationCap, ShieldCheck } from "lucide-react";
import { createClient, hasSupabaseEnv } from "../../lib/supabase/client";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("error") || params.get("error_description");
    if (authError) {
      setError(authError);
    }
  }, []);

  async function continueWithGoogle() {
    const supabase = createClient();
    if (supabase) {
      setLoading(true);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const callbackUrl = new URL("/auth/callback", siteUrl);
      callbackUrl.searchParams.set("next", "/dashboard");
      callbackUrl.searchParams.set("role", "student");

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });

      if (signInError) {
        setLoading(false);
        setError(signInError.message);
      }

      return;
    }

    const session = {
      authProvider: "google",
      authMode: "local-preview",
      collegeCode: "------",
      collegeName: "student workspace",
      email: "anika@college.edu",
      name: "anika rao",
      role: "student",
    };

    window.localStorage.setItem("cavite-session", JSON.stringify(session));
    window.location.href = "/dashboard";
  }

  return (
    <main className="auth-shell simple-auth-shell">
      <div className="mesh mesh-a" />
      <div className="mesh mesh-b" />
      <div className="grain" />

      <aside className="auth-content">
        <a className="auth-brand" href="/">
          cavite.
        </a>
        <span>campus access</span>
        <h1>track every application clearly.</h1>
        <p>
          sign in once, manage resumes, view live application stages, and get a clear
          ending for every opportunity.
        </p>
        <div className="auth-points">
          <div>
            <CheckCircle2 size={17} />
            live status
          </div>
          <div>
            <GraduationCap size={17} />
            campus profile
          </div>
          <div>
            <ShieldCheck size={17} />
            role-safe access
          </div>
        </div>
      </aside>

      <section className="auth-card simple-auth-card">
        <div className="auth-copy">
          <span>login</span>
          <h2>welcome to cavite.</h2>
          <p>sign in with google to access your campus dashboard.</p>
        </div>

        {!hasSupabaseEnv() ? (
          <p className="auth-note">preview mode: add Supabase keys to enable real google login.</p>
        ) : null}
        {error ? <p className="auth-error">{error}</p> : null}

        <button className="google-button" disabled={loading} onClick={continueWithGoogle} type="button">
          <span>G</span>
          {loading ? "opening google..." : "continue with google"}
          <ArrowRight size={17} />
        </button>

        <a className="admin-link" href="/admin">
          admin login
        </a>
      </section>
    </main>
  );
}
