"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  Building,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Filter,
  FileText,
  Globe,
  HelpCircle,
  IndianRupee,
  Layers3,
  Lock,
  MessageCircle,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  UsersRound,
  X,
} from "lucide-react";
import { useTheme } from "./theme-provider";

const metrics = [
  ["24/7", "live tracking"],
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

const adminFeatures = [
  {
    icon: Layers3,
    title: "design any hiring flow",
    body: "create custom phases that match your exact drive requirements.",
  },
  {
    icon: UsersRound,
    title: "unified candidate pool",
    body: "track every application, shortlist, and interview in one place.",
  },
  {
    icon: ShieldCheck,
    title: "verified placement data",
    body: "generate authentic outcome reports with zero manual data entry.",
  },
];

const studentFeatures = [
  {
    icon: FileText,
    title: "apply with the right resume",
    body: "build and select the perfect resume tailored for each specific role.",
  },
  {
    icon: Clock3,
    title: "always know your status",
    body: "never get ghosted. track every pending decision.",
  },
  {
    icon: MessageCircle,
    title: "close with feedback",
    body: "receive actionable feedback if you don't make the final cut.",
  },
];

const navItems = [
  { id: "product", label: "product", icon: Layers3 },
  { id: "pricing", label: "pricing", icon: IndianRupee },
  { id: "faqs", label: "faqs", icon: HelpCircle },
  { id: "contact", label: "contact us", icon: MessageCircle },
];

type DemoStatus = "idle" | "submitting" | "success" | "error";

const initialDemoForm = {
  collegeName: "",
  email: "",
  phone: "",
  role: "",
};

const faqsList = [
  { q: "how long does it take to migrate our existing data?", a: "we can import your existing student lists and past drives in less than 48 hours during onboarding." },
  { q: "do students pay to use cavite?", a: "no, cavite is completely free for students. the college pays the annual platform fee." },
  { q: "can we use cavite for our alumni network?", a: "yes, alumni can retain their unified profiles to access lateral hiring drives hosted by the college." }
];

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("product");
  const [activePanel, setActivePanel] = useState("drives");
  const [activeStage, setActiveStage] = useState("assessment");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoForm, setDemoForm] = useState(initialDemoForm);
  const [demoStatus, setDemoStatus] = useState<DemoStatus>("idle");
  const [demoMessage, setDemoMessage] = useState("");

  useEffect(() => {
    const updateNav = () => setNavOpen(window.scrollY > 72);

    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });
    return () => window.removeEventListener("scroll", updateNav);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.08, 0.18, 0.32, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function openDemo() {
    setDemoOpen(true);
    setDemoStatus("idle");
    setDemoMessage("");
  }

  function closeDemo() {
    setDemoOpen(false);
    setDemoStatus("idle");
    setDemoMessage("");
  }

  async function submitDemo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDemoStatus("submitting");
    setDemoMessage("");

    const response = await fetch("/api/book-demo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(demoForm),
    });
    const result = await response.json();

    if (!response.ok) {
      setDemoStatus("error");
      setDemoMessage(result.error || "could not book demo right now");
      return;
    }

    setDemoStatus("success");
    setDemoForm(initialDemoForm);
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
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                className={activeSection === item.id ? "active" : ""}
                href={`#${item.id}`}
                key={item.id}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
        <div className="nav-actions">
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button className="nav-cta" onClick={openDemo} type="button">
            book demo
          </button>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-kicker">
          <span />
          campus placement operating system
        </div>
        <h1>every application deserves an answer.</h1>
        <p className="hero-copy">
          run drives, shortlists, resumes, feedback, and clear outcomes in one
          clean campus workspace.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="/login">
            start early access <ArrowRight size={17} />
          </a>
          <a className="secondary-button" href="/dashboard">
            view product
          </a>
        </div>

        <div className="contrast-graphic" aria-hidden="true">
          <div className="cg-bg"></div>
          <div className="cg-main">
            <div className="cg-card">
              <div className="cg-header">
                <div className="cg-dot red"></div>
                <div className="cg-dot yellow"></div>
                <div className="cg-dot green"></div>
              </div>
              <div className="cg-body">
                <div className="cg-metrics">
                  {metrics.map(([value, label]) => (
                    <div className="cg-metric" key={label}>
                      <strong>{value}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
                <div className="cg-progress-bar">
                  <div className="cg-progress-fill"></div>
                </div>
              </div>
            </div>
            <div className="cg-float-card">
              <ShieldCheck size={28} className="cg-icon" />
              <div className="cg-text">
                <strong>Outcome Verified</strong>
                <span>candidate notified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="product">
        <div className="section-heading">
          <span>product</span>
          <h2>placement ops without the noise.</h2>
        </div>
        <div className="persona-section">
          <div className="persona-heading">
             <h3>for placement teams</h3>
             <p>run drives, manage shortlists, and track outcomes effortlessly.</p>
          </div>
          <div className="feature-grid">
            {adminFeatures.map((feature) => {
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
        </div>

        <div className="persona-section">
          <div className="persona-heading">
             <h3>for students</h3>
             <p>never get ghosted again. track every application with absolute clarity.</p>
          </div>
          <div className="feature-grid">
            {studentFeatures.map((feature) => {
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
        <div className="venn-wrapper">
          <div className="venn-diagram">
            <div className="venn-circle venn-private">
              <Lock size={24} className="venn-icon" />
              <span>College Drives<br/>& Analytics</span>
            </div>
            <div className="venn-circle venn-shared">
              <Globe size={24} className="venn-icon primary" />
              <span>Global Hiring<br/>Marketplace</span>
            </div>
            <div className="venn-center">
              <ShieldCheck size={20} className="venn-icon center" />
              <span>Student<br/>Profile</span>
            </div>
          </div>
          <p className="venn-caption">
            Only the verified student profile bridges the gap. Your internal college data never leaves the private zone.
          </p>
        </div>
      </section>

      <section className="section" id="workflow">
        <div className="section-heading">
          <span>workflow</span>
          <h2>students always know where they stand.</h2>
        </div>
        
        <div className="workflow-cards-row">
          <div className="wf-card">
            <h4>Post Drive</h4>
            <p>Create phases & rules</p>
          </div>
          
          <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="straight-arrow">
            <line x1="0" y1="12" x2="28" y2="12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="marching-ants" />
            <path d="M22,7 L29,12 L22,17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>

          <div className="wf-card">
            <h4>Set Stages</h4>
            <p>Define custom workflows</p>
          </div>

          <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="straight-arrow">
            <line x1="0" y1="12" x2="28" y2="12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="marching-ants" />
            <path d="M22,7 L29,12 L22,17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>

          <div className="wf-card primary">
            <h4>Collect Apps</h4>
            <p>Verified student profiles</p>
          </div>

          <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="straight-arrow">
            <line x1="0" y1="12" x2="28" y2="12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="marching-ants" />
            <path d="M22,7 L29,12 L22,17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>

          <div className="wf-card">
            <h4>Shortlists</h4>
            <p>Filter & publish updates</p>
          </div>

          <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="straight-arrow">
            <line x1="0" y1="12" x2="28" y2="12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="marching-ants" />
            <path d="M22,7 L29,12 L22,17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>

          <div className="wf-card">
            <h4>Feedback</h4>
            <p>Close loop with insights</p>
          </div>
        </div>
      </section>

      <section className="section" id="pricing">
        <div className="section-heading">
          <span>pricing</span>
          <h2>transparent plans for indian colleges.</h2>
        </div>
        <div className="pricing-grid two-tier">
          <div className="pricing-card popular">
            <div className="popular-badge">all features included</div>
            <span>cavite platform</span>
            <h3>₹249<small>/ student / mo</small></h3>
            <p>billed annually. everything your college needs to run seamless placements.</p>
            <ul>
              <li><CheckCircle2 size={16} /> unlimited college admins</li>
              <li><CheckCircle2 size={16} /> custom hiring phases & drives</li>
              <li><CheckCircle2 size={16} /> advanced outcome analytics</li>
              <li><CheckCircle2 size={16} /> verified student portfolios</li>
            </ul>
            <button className="primary-button" onClick={openDemo} type="button">book onboarding</button>
          </div>
          <div className="pricing-card">
            <span>enterprise</span>
            <h3>custom</h3>
            <p>for massive university networks requiring global scale.</p>
            <ul>
              <li><CheckCircle2 size={16} /> custom white-labeled domain</li>
              <li><CheckCircle2 size={16} /> university sso integration</li>
              <li><CheckCircle2 size={16} /> dedicated success manager</li>
            </ul>
            <button className="secondary-button" onClick={openDemo} type="button">talk to founder</button>
          </div>
        </div>
      </section>

      <section className="section" id="faqs">
        <div className="section-heading">
          <span>faqs</span>
          <h2>common questions.</h2>
        </div>
        <div className="faqs-list">
          {faqsList.map((faq, i) => (
            <div 
              key={i} 
              className={`faq-card ${openFaq === i ? 'open' : ''}`}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="faq-header">
                <h3>{faq.q}</h3>
                <div className="faq-toggle">
                  <ChevronDown size={20} />
                </div>
              </div>
              <div className="faq-body">
                <div className="faq-body-inner">
                  <p>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta" id="contact">
        <div>
          <Bell size={22} />
          <h2>give your first placement drive a transparent outcome layer.</h2>
          <p>
            start with one college, one admin team, and one drive.
          </p>
          <button className="primary-button" onClick={openDemo} type="button">
            contact us <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <footer className="modern-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <h2>cavite.</h2>
            <p>no ghosting. clear outcomes. giving your placement drive a transparent outcome layer.</p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#workflow">workflow</a>
              <a href="#product">features</a>
              <a href="#pricing">pricing</a>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="#faqs">faqs</a>
              <a href="#">help center</a>
              <a href="#contact">contact</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#">privacy</a>
              <a href="#">terms</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} cavite. all rights reserved.</p>
          <div className="status-indicator">
            <span className="status-dot"></span> all systems operational
          </div>
        </div>
      </footer>

      {demoOpen ? (
        <div className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-title">
          <button className="demo-backdrop" onClick={closeDemo} type="button" aria-label="Close demo form" />
          <section className={demoStatus === "success" ? "demo-card success" : "demo-card"}>
            {demoStatus !== "success" ? (
              <div className="demo-visual" aria-hidden="true">
                <div className="demo-art">
                  <div className="demo-calendar-icon">
                    <CalendarDays size={80} strokeWidth={1.5} />
                  </div>
                </div>
                <div className="demo-visual-copy">
                  <strong>show us how placements run at your college.</strong>
                  <p>we will map cavite around your drives, students, phases, and outcome process.</p>
                </div>
              </div>
            ) : null}
            {demoStatus === "success" ? (
              <div className="demo-success">
                <div className="success-icon">
                  <svg className="animated-check" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" className="check-circle" />
                    <path d="M8 12l3 3 5-6" className="check-path" />
                  </svg>
                </div>
                <span>demo request received</span>
                <h2 id="demo-title">we will connect with you soon.</h2>
                <p>
                  thank you for trusting cavite with your placement story. we will reach out shortly
                  to schedule a calm, useful conversation.
                </p>
                <button className="primary-button" onClick={closeDemo} type="button">
                  done
                </button>
              </div>
            ) : (
              <form className="demo-form" onSubmit={submitDemo}>
                <div className="demo-head">
                  <div>
                    <span>book demo</span>
                    <h2 id="demo-title">tell us where to reach you.</h2>
                  </div>
                  <button className="demo-close" onClick={closeDemo} type="button" aria-label="Close demo form">
                    <X size={17} />
                  </button>
                </div>

                <label>
                  <span>college name</span>
                  <input
                    onChange={(event) => setDemoForm((form) => ({ ...form, collegeName: event.target.value }))}
                    placeholder="northbridge college"
                    required
                    value={demoForm.collegeName}
                  />
                </label>
                <label>
                  <span>your email</span>
                  <input
                    onChange={(event) => setDemoForm((form) => ({ ...form, email: event.target.value }))}
                    placeholder="placements@college.edu"
                    required
                    type="email"
                    value={demoForm.email}
                  />
                </label>
                <label>
                  <span>your phone</span>
                  <input
                    onChange={(event) => setDemoForm((form) => ({ ...form, phone: event.target.value }))}
                    placeholder="+91 98765 43210"
                    required
                    value={demoForm.phone}
                  />
                </label>
                <label>
                  <span>role</span>
                  <input
                    onChange={(event) => setDemoForm((form) => ({ ...form, role: event.target.value }))}
                    placeholder="placement officer"
                    required
                    value={demoForm.role}
                  />
                </label>

                {demoStatus === "error" ? <p className="demo-error">{demoMessage}</p> : null}

                <button className="primary-button" disabled={demoStatus === "submitting"} type="submit">
                  {demoStatus === "submitting" ? "sending..." : "request demo"} <ArrowRight size={17} />
                </button>
              </form>
            )}
          </section>
        </div>
      ) : null}
    </main>
  );
}
