"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Building2, KeyRound, ShieldCheck } from "lucide-react";
import { createClient, hasSupabaseEnv } from "../../lib/supabase/client";

type AdminMode = "college_admin" | "super_admin";

export default function AdminLoginPage() {
  const [mode, setMode] = useState<AdminMode>("college_admin");
  const [collegeCode, setCollegeCode] = useState("A7F21C");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizedCode = useMemo(() => collegeCode.trim().toUpperCase(), [collegeCode]);
  const isValidCode = /^[0-9A-F]{6}$/.test(normalizedCode);

  async function continueWithPassword() {
    if (!isValidCode) {
      setError("enter a valid 6-digit college code");
      return;
    }

    if (!email || !password) {
      setError("enter email and password");
      return;
    }

    const supabase = createClient();
    if (supabase) {
      setLoading(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setLoading(false);
        setError(signInError.message);
        return;
      }

      const { error: joinError } = await (supabase as any).rpc("join_college_workspace", {
        join_code: normalizedCode,
        requested_role: mode,
      });

      if (joinError) {
        setLoading(false);
        setError(joinError.message);
        return;
      }

      window.localStorage.setItem("cavite-admin-mode", mode);
      window.location.href = "/dashboard";
      return;
    }

    window.localStorage.setItem(
      "cavite-session",
      JSON.stringify({
        authProvider: "password",
        authMode: "local-preview",
        collegeCode: normalizedCode,
        collegeName: "northbridge college",
        email,
        name: mode === "college_admin" ? "placement admin" : "super admin",
        role: mode === "college_admin" ? "college_admin" : "super_admin",
        membershipStatus: "active",
      }),
    );
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
        <span>admin access</span>
        <h1>control your college workspace.</h1>
        <p>
          admins manage drives. super admins approve users, review activity,
          and control settings for their own college.
        </p>
        <div className="auth-points">
          <div>
            <Building2 size={17} />
            college code
          </div>
          <div>
            <ShieldCheck size={17} />
            approval layer
          </div>
          <div>
            <KeyRound size={17} />
            password access
          </div>
        </div>
      </aside>

      <section className="auth-card simple-auth-card">
        <div className="mode-switch">
          <button
            className={mode === "college_admin" ? "active" : ""}
            onClick={() => {
              setMode("college_admin");
              setError("");
            }}
            type="button"
          >
            college admin
          </button>
          <button
            className={mode === "super_admin" ? "active" : ""}
            onClick={() => {
              setMode("super_admin");
              setError("");
            }}
            type="button"
          >
            college super admin
          </button>
        </div>

        <div className="auth-copy">
          <span>{mode === "college_admin" ? "college login" : "super admin login"}</span>
          <h2>{mode === "college_admin" ? "enter admin workspace." : "enter college control."}</h2>
          <p>{mode === "college_admin" ? "use college code, email, and password." : "use college code and super admin credentials."}</p>
        </div>

        <label className="code-field">
          <span>college code</span>
          <input
            maxLength={6}
            onChange={(event) => {
              setCollegeCode(event.target.value.replace(/[^0-9a-fA-F]/g, ""));
              setError("");
            }}
            placeholder="A7F21C"
            value={collegeCode}
          />
        </label>

        <div className="field-stack">
          <label>
            <span>email</span>
            <input
              autoComplete="email"
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="admin@college.edu"
              type="email"
              value={email}
            />
          </label>
          <label>
            <span>password</span>
            <input
              autoComplete="current-password"
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="password"
              type="password"
              value={password}
            />
          </label>
        </div>

        {!hasSupabaseEnv() ? <p className="auth-note">preview mode: Supabase env not found.</p> : null}
        {error ? <p className="auth-error">{error}</p> : null}

        <button className="google-button" disabled={loading} onClick={continueWithPassword} type="button">
          {loading ? "checking access..." : "continue"}
          <ArrowRight size={17} />
        </button>

        <a className="admin-link" href="/login">
          student login
        </a>
      </section>
    </main>
  );
}
