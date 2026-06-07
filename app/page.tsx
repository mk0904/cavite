"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  FileText,
  Layers3,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  UsersRound,
} from "lucide-react";

const metrics = [
  ["14d", "decision window"],
  ["100%", "status visibility"],
  ["0", "silent endings"],
];

const stages = [
  { name: "applied", count: "184", status: "open", width: "100%" },
  { name: "assessment", count: "76", status: "live", width: "56%" },
  { name: "interview", count: "28", status: "today", width: "24%" },
  { name: "outcome", count: "11", status: "closed", width: "10%" },
];

const candidates = [
  ["anika rao", "react, ui", "interview", "8d left", "92%"],
  ["rahul mehta", "next.js", "feedback", "2d left", "84%"],
  ["priya sen", "typescript", "shortlisted", "today", "79%"],
];

const features = [
  {
    icon: Layers3,
    title: "design any hiring flow",
    body: "create phases that match each drive.",
  },
  {
    icon: Clock3,
    title: "protect the 14-day promise",
    body: "track every pending decision.",
  },
  {
    icon: FileText,
    title: "apply with the right resume",
    body: "pick the best resume per role.",
  },
  {
    icon: ShieldCheck,
    title: "close with feedback",
    body: "end every application clearly.",
  },
];

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [navOpen, setNavOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("drives");
  const [activeStage, setActiveStage] = useState("assessment");

  useEffect(() => {
    const stored = window.localStorage.getItem("cavite-theme");
    const next = stored === "dark" || stored === "light" ? stored : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }, []);

  useEffect(() => {
    const updateNav = () => setNavOpen(window.scrollY > 72);

    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });
    return () => window.removeEventListener("scroll", updateNav);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("cavite-theme", next);
  }

  return (
    <main>
      <div className="mesh mesh-a" />
      <div className="mesh mesh-b" />
      <div className="grain" />

      <nav className={navOpen ? "nav nav-open" : "nav"} aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Cavite home">
          cavite.
        </a>
        <div className="nav-links">
          <a href="#product">product</a>
          <a href="#campus">campus</a>
          <a href="#workflow">workflow</a>
          <a href="#access">access</a>
        </div>
        <div className="nav-actions">
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <a className="nav-cta" href="mailto:hello@cavite.in">
            book demo
          </a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-kicker">
          <span />
          campus placement operating system
        </div>
        <h1>every application deserves an answer.</h1>
        <p className="hero-copy">
          run drives, shortlists, resumes, feedback, and 14-day outcomes in one
          clean campus workspace.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="mailto:hello@cavite.in">
            start early access <ArrowRight size={17} />
          </a>
          <a className="secondary-button" href="#product">
            view product
          </a>
        </div>

        <section className="console" aria-label="Cavite placement dashboard preview">
          <div className="console-sidebar">
            <div className="sidebar-logo">cv</div>
            {["drives", "students", "resumes", "reports"].map((item) => (
              <button
                className={activePanel === item ? "side-link active" : "side-link"}
                key={item}
                onClick={() => setActivePanel(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="console-main">
            <div className="console-header">
              <div>
                <span>campus drive</span>
                <strong>frontend intern at nova labs</strong>
              </div>
              <div className="console-tools">
                <div className="mock-search">
                  <Search size={14} />
                  search students
                </div>
                <button className="tool-button" type="button">
                  <Filter size={14} />
                  filter
                </button>
                <div className="live-pill">
                  <i />
                  live
                </div>
              </div>
            </div>

            <div className="stage-grid">
              {stages.map((stage) => (
                <button
                  className={activeStage === stage.name ? "stage-card active" : "stage-card"}
                  key={stage.name}
                  onClick={() => setActiveStage(stage.name)}
                  type="button"
                >
                  <span>{stage.status}</span>
                  <strong>{stage.count}</strong>
                  <p>{stage.name}</p>
                  <div className="stage-meter">
                    <i style={{ width: stage.width }} />
                  </div>
                </button>
              ))}
            </div>

            <div className="console-bottom">
              <div className="timeline-card">
                <div className="timeline-top">
                  <Clock3 size={17} />
                  outcome clock
                </div>
                <div className="date-row">
                  <CalendarDays size={15} />
                  result due on june 15
                </div>
                <div className="progress-track">
                  <span />
                </div>
                <p>8 days left before final status is required.</p>
              </div>
              <div className="candidate-card">
                <div className="candidate-head">
                  <span>candidate pool</span>
                  <strong>{activeStage}</strong>
                </div>
                {candidates.map(([name, skills, status, eta, match]) => (
                  <div className="candidate-row" key={name}>
                    <div>
                      <strong>{name}</strong>
                      <span>{skills}</span>
                    </div>
                    <em>{status}</em>
                    <span>{eta}</span>
                    <b>{match}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="metric-strip">
        {metrics.map(([value, label]) => (
          <div className="metric" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="section" id="product">
        <div className="section-heading">
          <span>product</span>
          <h2>placement ops without the noise.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon">
                  <Icon size={21} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section split" id="campus">
        <div>
          <span className="label">campus first</span>
          <h2>private college workspaces. shared cavite identity.</h2>
          <p>
            each college stays private. students keep one profile that can later
            unlock cavite main.
          </p>
        </div>
        <div className="identity-card">
          <div className="identity-row active">
            <UsersRound size={19} />
            <span>college workspace</span>
          </div>
          <div className="identity-row">
            <ShieldCheck size={19} />
            <span>verified student profile</span>
          </div>
          <div className="identity-row">
            <CheckCircle2 size={19} />
            <span>future marketplace access</span>
          </div>
        </div>
      </section>

      <section className="section" id="workflow">
        <div className="section-heading">
          <span>workflow</span>
          <h2>students always know where they stand.</h2>
        </div>
        <div className="workflow-grid">
          {["post drive", "set stages", "collect applications", "publish shortlists", "close with feedback"].map(
            (step, index) => (
              <article className="workflow-card" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="cta" id="access">
        <div>
          <Bell size={22} />
          <h2>give your first placement drive a transparent outcome layer.</h2>
          <p>
            start with one college, one admin team, and one drive.
          </p>
          <a className="primary-button" href="mailto:hello@cavite.in">
            book demo <ArrowRight size={17} />
          </a>
        </div>
      </section>

      <footer>
        <strong>cavite.</strong>
        <span>no ghosting. clear outcomes.</span>
        <div>
          <a href="#product">product</a>
          <a href="#campus">campus</a>
          <a href="mailto:hello@cavite.in">contact</a>
        </div>
      </footer>
    </main>
  );
}
