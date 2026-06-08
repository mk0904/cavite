"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  GraduationCap,
  LayoutDashboard,
  ListFilter,
  LogOut,
  MessageSquareText,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  UsersRound,
} from "lucide-react";
import { createClient } from "../../lib/supabase/client";

type Role = "college_admin" | "student" | "super_admin";

type Session = {
  authProvider: string;
  authMode?: "supabase" | "local-preview";
  collegeCode: string;
  collegeName: string;
  email: string;
  name: string;
  role: Role;
  membershipStatus?: "active" | "pending" | "suspended";
};

type StudentWorkspace = {
  membership:
    | {
        collegeId: string;
        collegeName: string | null;
        status: "active" | "pending" | "suspended";
      }
    | null;
  opportunities: Array<{
    id: string;
    title: string;
    company: string;
    workType: string;
    status: string;
    requiredSkills: string[];
    closesAt: string | null;
  }>;
  applications: Array<{
    id: string;
    title: string;
    company: string;
    phase: string;
    status: string;
    outcomeDueAt: string;
    resume: string;
    feedback: string | null;
  }>;
  resumes: Array<{
    id: string;
    label: string;
    roleFocus: string | null;
    createdAt: string;
  }>;
};

const emptyStudentWorkspace: StudentWorkspace = {
  membership: null,
  opportunities: [],
  applications: [],
  resumes: [],
};

const drives = [
  {
    id: "nova-frontend",
    company: "nova labs",
    role: "frontend intern",
    type: "internship",
    applications: 184,
    selected: 11,
    deadline: "8d left",
    status: "live",
    skills: ["react", "typescript", "ui"],
  },
  {
    id: "atlas-data",
    company: "atlas cloud",
    role: "data analyst",
    type: "full-time",
    applications: 96,
    selected: 4,
    deadline: "3d left",
    status: "review",
    skills: ["sql", "python", "excel"],
  },
  {
    id: "pixel-design",
    company: "pixel forge",
    role: "product design fellow",
    type: "freelance",
    applications: 58,
    selected: 0,
    deadline: "12d left",
    status: "open",
    skills: ["figma", "ux", "portfolio"],
  },
];

const phases = [
  { name: "applied", count: 184 },
  { name: "assessment", count: 76 },
  { name: "interview", count: 28 },
  { name: "selected", count: 11 },
];

const students = [
  {
    name: "anika rao",
    branch: "cse 2027",
    skills: "react, typescript",
    phase: "interview",
    resume: "frontend-v3.pdf",
    match: 92,
    eta: "8d left",
    status: "shortlisted",
  },
  {
    name: "rahul mehta",
    branch: "it 2027",
    skills: "next.js, node",
    phase: "assessment",
    resume: "web-role.pdf",
    match: 84,
    eta: "2d left",
    status: "feedback due",
  },
  {
    name: "priya sen",
    branch: "ece 2026",
    skills: "typescript, ui",
    phase: "selected",
    resume: "product-ui.pdf",
    match: 79,
    eta: "today",
    status: "selected",
  },
  {
    name: "kabir khan",
    branch: "cse 2026",
    skills: "react, testing",
    phase: "applied",
    resume: "frontend.pdf",
    match: 74,
    eta: "13d left",
    status: "new",
  },
];

const adminNav = [
  { id: "overview", label: "overview", icon: LayoutDashboard },
  { id: "drives", label: "drives", icon: BriefcaseBusiness },
  { id: "students", label: "students", icon: UsersRound },
  { id: "feedback", label: "feedback", icon: MessageSquareText },
  { id: "settings", label: "settings", icon: Settings },
];

const studentNav = [
  { id: "home", label: "home", icon: LayoutDashboard },
  { id: "opportunities", label: "opportunities", icon: BriefcaseBusiness },
  { id: "applications", label: "applications", icon: Clock3 },
  { id: "resumes", label: "resumes", icon: FileText },
  { id: "practice", label: "practice", icon: BookOpenCheck },
];

function daysUntil(dateString: string) {
  const ms = new Date(dateString).getTime() - Date.now();
  const days = Math.ceil(ms / 86_400_000);

  if (Number.isNaN(days)) {
    return "pending";
  }

  if (days <= 0) {
    return "today";
  }

  return `${days}d left`;
}

function formatDate(dateString: string | null) {
  if (!dateString) {
    return "rolling";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(new Date(dateString));
}

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [activeView, setActiveView] = useState("overview");
  const [activeDrive, setActiveDrive] = useState(drives[0]);
  const [activePhase, setActivePhase] = useState("assessment");
  const [query, setQuery] = useState("");
  const [studentWorkspace, setStudentWorkspace] = useState<StudentWorkspace>(emptyStudentWorkspace);
  const [joinCode, setJoinCode] = useState("A7F21C");
  const [studentMessage, setStudentMessage] = useState("");

  async function loadStudentWorkspace(supabase: NonNullable<ReturnType<typeof createClient>>, userId: string) {
    const { data: membership } = await supabase
      .from("college_memberships")
      .select("college_id,status,colleges(name,code)")
      .eq("user_id", userId)
      .eq("role", "student")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const membershipRow = membership as
      | {
          college_id: string;
          colleges: { name: string; code: string } | null;
          status: "active" | "pending" | "suspended";
        }
      | null;

    if (!membershipRow || membershipRow.status !== "active") {
      setStudentWorkspace({
        ...emptyStudentWorkspace,
        membership: membershipRow
          ? {
              collegeId: membershipRow.college_id,
              collegeName: membershipRow.colleges?.name || null,
              status: membershipRow.status,
            }
          : null,
      });
      return;
    }

    const [{ data: driveRows }, { data: applicationRows }, { data: resumeRows }] = await Promise.all([
      supabase
        .from("drives")
        .select("id,title,company,work_type,status,required_skills,closes_at")
        .eq("college_id", membershipRow.college_id)
        .in("status", ["open", "live"])
        .order("created_at", { ascending: false }),
      supabase
        .from("applications")
        .select("id,status,outcome_due_at,feedback,drives(title,company),drive_phases(name),resumes(label)")
        .eq("student_id", userId)
        .order("updated_at", { ascending: false }),
      supabase
        .from("resumes")
        .select("id,label,role_focus,created_at")
        .eq("student_id", userId)
        .eq("college_id", membershipRow.college_id)
        .order("created_at", { ascending: false }),
    ]);

    const typedApplications = (applicationRows || []) as Array<{
      id: string;
      status: string;
      outcome_due_at: string;
      feedback: string | null;
      drives: { title: string; company: string } | null;
      drive_phases: { name: string } | null;
      resumes: { label: string } | null;
    }>;
    const typedDrives = (driveRows || []) as Array<{
      id: string;
      title: string;
      company: string;
      work_type: string;
      status: string;
      required_skills: string[] | null;
      closes_at: string | null;
    }>;
    const typedResumes = (resumeRows || []) as Array<{
      id: string;
      label: string;
      role_focus: string | null;
      created_at: string;
    }>;

    setStudentWorkspace({
      membership: {
        collegeId: membershipRow.college_id,
        collegeName: membershipRow.colleges?.name || null,
        status: membershipRow.status,
      },
      opportunities: typedDrives.map((drive) => ({
        id: drive.id,
        title: drive.title,
        company: drive.company,
        workType: drive.work_type,
        status: drive.status,
        requiredSkills: drive.required_skills || [],
        closesAt: drive.closes_at,
      })),
      applications: typedApplications.map((application) => ({
        id: application.id,
        title: application.drives?.title || "opportunity",
        company: application.drives?.company || "company",
        phase: application.drive_phases?.name || application.status.replace("_", " "),
        status: application.status.replace("_", " "),
        outcomeDueAt: application.outcome_due_at,
        resume: application.resumes?.label || "not attached",
        feedback: application.feedback,
      })),
      resumes: typedResumes.map((resume) => ({
        id: resume.id,
        label: resume.label,
        roleFocus: resume.role_focus,
        createdAt: resume.created_at,
      })),
    });
  }

  useEffect(() => {
    const supabase = createClient();
    if (supabase) {
      supabase.auth.getUser().then(async ({ data, error }) => {
        if (error || !data.user) {
          window.location.href = "/login";
          return;
        }

        const { data: membership } = await supabase
          .from("college_memberships")
          .select("role,status,college_id,colleges(name,code)")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        const membershipRow = membership as
          | {
              role: Role;
              status: "active" | "pending" | "suspended";
              college_id: string;
              colleges: { name: string; code: string } | null;
            }
          | null;

        const adminMode = window.localStorage.getItem("cavite-admin-mode");
        const role: Role = adminMode === "super_admin" ? "super_admin" : membershipRow?.role || "student";

        setSession({
          authProvider: adminMode ? "password" : "google",
          authMode: "supabase",
          collegeCode: membershipRow?.colleges?.code || "------",
          collegeName: membershipRow?.colleges?.name || "college workspace",
          email: data.user.email || "student@college.edu",
          name:
            data.user.user_metadata?.full_name ||
            data.user.email?.split("@")[0] ||
            "cavite user",
          role,
          membershipStatus: membershipRow?.status || "pending",
        });
        setActiveView(role === "student" ? "home" : "overview");
        if (role === "student") {
          await loadStudentWorkspace(supabase, data.user.id);
        }
      });

      return;
    }

    const stored = window.localStorage.getItem("cavite-session");
    if (!stored) {
      window.location.href = "/login";
      return;
    }

    const parsed = JSON.parse(stored) as Session;
    setSession(parsed);
    setActiveView(parsed.role === "student" ? "home" : "overview");
  }, []);

  const filteredStudents = useMemo(() => {
    const term = query.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch =
        !term ||
        student.name.includes(term) ||
        student.skills.includes(term) ||
        student.branch.includes(term);
      const matchesPhase = activePhase === "all" || student.phase === activePhase;
      return matchesSearch && matchesPhase;
    });
  }, [activePhase, query]);

  async function logout() {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
      window.localStorage.removeItem("cavite-admin-mode");
      window.location.href = "/login";
      return;
    }

    window.localStorage.removeItem("cavite-session");
    window.localStorage.removeItem("cavite-admin-mode");
    window.location.href = "/login";
  }

  async function joinStudentWorkspace() {
    const normalized = joinCode.trim().toUpperCase();
    if (!/^[0-9A-F]{6}$/.test(normalized)) {
      setStudentMessage("enter a valid 6-digit college code");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setStudentMessage("Supabase is not configured");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { error } = await (supabase as any).rpc("join_college_workspace", {
      join_code: normalized,
      requested_role: "student",
    });

    if (error) {
      setStudentMessage(error.message);
      return;
    }

    setStudentMessage("workspace joined");
    await loadStudentWorkspace(supabase, user.id);
    window.location.reload();
  }

  async function applyToDrive(driveId: string) {
    const supabase = createClient();
    if (!supabase) {
      setStudentMessage("Supabase is not configured");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const selectedResume = studentWorkspace.resumes[0]?.id || null;
    const { error } = await (supabase as any).rpc("apply_to_drive", {
      target_drive_id: driveId,
      selected_resume_id: selectedResume,
    });

    if (error) {
      setStudentMessage(error.message);
      return;
    }

    setStudentMessage("application created");
    await loadStudentWorkspace(supabase, user.id);
  }

  if (!session) {
    return (
      <main className="app-loading">
        <div className="mesh mesh-a" />
        <div className="grain" />
        <p>opening cavite workspace...</p>
      </main>
    );
  }

  const isAdmin = session.role !== "student";
  const navItems = isAdmin ? adminNav : studentNav;

  return (
    <main className="app-shell">
      <aside className="app-sidebar">
        <a className="app-brand" href="/">
          cavite.
        </a>
        <nav className="app-nav" aria-label="dashboard navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={activeView === item.id ? "app-nav-item active" : "app-nav-item"}
                key={item.id}
                onClick={() => setActiveView(item.id)}
                type="button"
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
        {isAdmin ? (
          <div className="workspace-switcher">
            <span>college workspace</span>
            <strong>{session.collegeName}</strong>
            <small>
              {session.collegeCode}
              {session.membershipStatus === "pending" ? " · pending" : ""}
            </small>
            <ChevronDown size={15} />
          </div>
        ) : (
          <StudentWorkspaceSwitch
            code={joinCode}
            message={studentMessage}
            onCodeChange={setJoinCode}
            onJoin={joinStudentWorkspace}
            workspace={studentWorkspace}
          />
        )}
        <div className="sidebar-card">
          {isAdmin ? <ShieldCheck size={18} /> : <GraduationCap size={18} />}
          <strong>
            {session.membershipStatus === "pending"
              ? "access pending"
              : session.role === "super_admin"
                ? "super admin access"
                : isAdmin
                  ? "admin permissions"
                : "student access"}
          </strong>
          <p>
            {session.membershipStatus === "pending"
              ? "your workspace request exists. approval rules can be enabled next."
              : session.role === "super_admin"
                ? "approve admins, students, and review college activity."
                : isAdmin
                  ? "post drives, move phases, close feedback."
                : "apply, track, prepare, and manage resumes."}
          </p>
        </div>
      </aside>

      <section className="app-main">
        <header className="app-topbar">
          <div>
            <span>{session.role === "super_admin" ? "super admin" : isAdmin ? "college admin" : "student profile"}</span>
            <h1>{session.role === "super_admin" ? "college control room" : isAdmin ? "placement command center" : "your placement workspace"}</h1>
          </div>
          <div className="topbar-actions">
            <div className="app-search">
              <Search size={16} />
              <input
                aria-label="search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={isAdmin ? "search students, skills, branches" : "search roles, companies, skills"}
                value={query}
              />
            </div>
            <button className="ghost-icon" type="button" aria-label="notifications">
              <Bell size={18} />
            </button>
            <button className="ghost-icon" onClick={logout} type="button" aria-label="logout">
              <LogOut size={18} />
            </button>
            {isAdmin ? (
              <button className="app-primary" type="button">
                <Plus size={17} />
                new drive
              </button>
            ) : (
              <button className="app-primary" type="button">
                <Upload size={17} />
                upload resume
              </button>
            )}
          </div>
        </header>

        {isAdmin ? (
          <AdminDashboard
            activeDrive={activeDrive}
            activePhase={activePhase}
            filteredStudents={filteredStudents}
            setActiveDrive={setActiveDrive}
            setActivePhase={setActivePhase}
          />
        ) : (
          <StudentDashboard
            message={studentMessage}
            onApply={applyToDrive}
            workspace={studentWorkspace}
          />
        )}
      </section>
    </main>
  );
}

function StudentWorkspaceSwitch({
  code,
  message,
  onCodeChange,
  onJoin,
  workspace,
}: {
  code: string;
  message: string;
  onCodeChange: (code: string) => void;
  onJoin: () => void;
  workspace: StudentWorkspace;
}) {
  const collegeName = workspace.membership?.collegeName;
  const status = workspace.membership?.status;

  if (workspace.membership) {
    return (
      <div className="workspace-switcher student-workspace-switch joined">
        <span>student workspace</span>
        <strong>
          cavite <sup>{collegeName || "campus"}</sup>
        </strong>
        <small>{status === "active" ? "connected" : status}</small>
      </div>
    );
  }

  return (
    <div className="workspace-switcher student-workspace-switch">
      <span>student workspace</span>
      <strong>
        join cavite <sup>campus</sup>
      </strong>
      <div className="sidebar-join">
        <input
          maxLength={6}
          onChange={(event) => onCodeChange(event.target.value.replace(/[^0-9a-fA-F]/g, ""))}
          placeholder="A7F21C"
          value={code}
        />
        <button onClick={onJoin} type="button">
          join
        </button>
      </div>
      {message ? <small>{message}</small> : null}
    </div>
  );
}

function AdminDashboard({
  activeDrive,
  activePhase,
  filteredStudents,
  setActiveDrive,
  setActivePhase,
}: {
  activeDrive: (typeof drives)[number];
  activePhase: string;
  filteredStudents: typeof students;
  setActiveDrive: (drive: (typeof drives)[number]) => void;
  setActivePhase: (phase: string) => void;
}) {
  return (
    <>
      <section className="summary-grid">
        {[
          ["active drives", "12", "+3 this week"],
          ["applications", "338", "42 moved today"],
          ["pending feedback", "23", "needs closure"],
          ["selected", "18", "across 4 drives"],
        ].map(([label, value, meta]) => (
          <article className="summary-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{meta}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <div className="panel drives-panel">
          <div className="panel-head">
            <div>
              <span>drives</span>
              <h2>live opportunities</h2>
            </div>
            <button className="panel-tool" type="button">
              <ListFilter size={16} />
              filter
            </button>
          </div>
          <div className="drive-list">
            {drives.map((drive) => (
              <button
                className={activeDrive.id === drive.id ? "drive-card active" : "drive-card"}
                key={drive.id}
                onClick={() => setActiveDrive(drive)}
                type="button"
              >
                <div>
                  <strong>{drive.role}</strong>
                  <span>{drive.company} · {drive.type}</span>
                </div>
                <em>{drive.status}</em>
                <p>{drive.applications} applications · {drive.deadline}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="panel pipeline-panel">
          <div className="panel-head">
            <div>
              <span>{activeDrive.company}</span>
              <h2>{activeDrive.role}</h2>
            </div>
            <button className="panel-tool" type="button">
              <SlidersHorizontal size={16} />
              edit phases
            </button>
          </div>
          <div className="phase-tabs">
            <button
              className={activePhase === "all" ? "phase-tab active" : "phase-tab"}
              onClick={() => setActivePhase("all")}
              type="button"
            >
              all
            </button>
            {phases.map((phase) => (
              <button
                className={activePhase === phase.name ? "phase-tab active" : "phase-tab"}
                key={phase.name}
                onClick={() => setActivePhase(phase.name)}
                type="button"
              >
                <span>{phase.name}</span>
                <strong>{phase.count}</strong>
              </button>
            ))}
          </div>

          <StudentTable students={filteredStudents} />
        </div>
      </section>

      <section className="bottom-grid">
        <article className="panel outcome-panel">
          <div className="panel-head">
            <div>
              <span>deadline health</span>
              <h2>outcome clock</h2>
            </div>
            <CalendarDays size={19} />
          </div>
          <div className="outcome-track">
            <i />
          </div>
          <p>8 days left for {activeDrive.role}. reminders scheduled for day 10 and day 13.</p>
        </article>

        <article className="panel feedback-panel">
          <div className="panel-head">
            <div>
              <span>feedback queue</span>
              <h2>closures needed</h2>
            </div>
            <ArrowRight size={18} />
          </div>
          {["rahul mehta", "isha malik", "dev patel"].map((name) => (
            <div className="feedback-row" key={name}>
              <FileText size={16} />
              <span>{name}</span>
              <strong>write feedback</strong>
            </div>
          ))}
        </article>
      </section>
    </>
  );
}

function StudentDashboard({
  message,
  onApply,
  workspace,
}: {
  message: string;
  onApply: (driveId: string) => void;
  workspace: StudentWorkspace;
}) {
  if (!workspace.membership) {
    return (
      <section className="panel student-empty-panel">
        <div className="panel-head">
          <div>
            <span>college workspace</span>
            <h2>you are signed in.</h2>
          </div>
          <GraduationCap size={20} />
        </div>
        <p>you can browse cavite as a normal user. to unlock campus drives, enter your college code from the left sidebar.</p>
        {message ? <p className="dashboard-message">{message}</p> : null}
      </section>
    );
  }

  if (workspace.membership.status !== "active") {
    return (
      <section className="panel student-empty-panel">
        <div className="panel-head">
          <div>
            <span>access pending</span>
            <h2>your college request is waiting.</h2>
          </div>
          <Clock3 size={20} />
        </div>
        <p>your placement team needs to approve your student access before drives and applications are visible.</p>
      </section>
    );
  }

  const activeApplications = workspace.applications.filter((application) => !["selected", "rejected", "withdrawn"].includes(application.status));
  const nextDue = workspace.applications
    .map((application) => new Date(application.outcomeDueAt).getTime())
    .filter((time) => !Number.isNaN(time))
    .sort((a, b) => a - b)[0];

  return (
    <>
      <section className="summary-grid">
        {[
          ["opportunities", String(workspace.opportunities.length), "open for your college"],
          ["applications", String(workspace.applications.length), `${activeApplications.length} active`],
          ["resumes", String(workspace.resumes.length), workspace.resumes[0]?.label || "upload one"],
          ["next outcome", nextDue ? daysUntil(new Date(nextDue).toISOString()) : "-", "14-day clock"],
        ].map(([label, value, meta]) => (
          <article className="summary-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{meta}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-grid student-grid">
        <article className="panel">
          <div className="panel-head">
            <div>
              <span>eligible now</span>
              <h2>opportunities</h2>
            </div>
            <BriefcaseBusiness size={19} />
          </div>
          <div className="drive-list">
            {workspace.opportunities.length ? workspace.opportunities.map((drive) => (
              <div className="drive-card opportunity-card" key={drive.id}>
                <div>
                  <strong>{drive.title}</strong>
                  <span>{drive.company} · {drive.requiredSkills.join(", ") || "skills open"}</span>
                </div>
                <em>{drive.status}</em>
                <p>{drive.workType} · closes {formatDate(drive.closesAt)}</p>
                <button className="mini-action" onClick={() => onApply(drive.id)} type="button">
                  apply
                </button>
              </div>
            )) : <EmptyPanelLine text="no open drives from your college yet." />}
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <span>live tracker</span>
              <h2>applications</h2>
            </div>
            <Clock3 size={19} />
          </div>
          <div className="application-list">
            {workspace.applications.length ? workspace.applications.map((application) => (
              <div className="application-card" key={application.id}>
                <div>
                  <strong>{application.title}</strong>
                  <span>{application.company} · {application.resume}</span>
                </div>
                <em>{application.phase}</em>
                <b>{daysUntil(application.outcomeDueAt)}</b>
              </div>
            )) : <EmptyPanelLine text="applications you create will show their live stage here." />}
          </div>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="panel">
          <div className="panel-head">
            <div>
              <span>resume vault</span>
              <h2>role-wise resumes</h2>
            </div>
            <FileText size={19} />
          </div>
          {workspace.resumes.length ? workspace.resumes.map((resume) => (
            <div className="feedback-row" key={resume.id}>
              <FileText size={16} />
              <span>{resume.label} · {resume.roleFocus || "general"}</span>
              <strong>{formatDate(resume.createdAt)}</strong>
            </div>
          )) : <EmptyPanelLine text="resume upload comes next; applications can still be tracked once added." />}
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <span>readiness</span>
              <h2>next best actions</h2>
            </div>
            <BookOpenCheck size={19} />
          </div>
          {[
            workspace.resumes.length ? "keep resumes role-specific" : "upload your first resume",
            workspace.applications.length ? "watch application clocks" : "apply when drives open",
            workspace.opportunities.length ? "match skills before applying" : "check back after admin posts drives",
          ].map((task) => (
            <div className="feedback-row" key={task}>
              <CheckCircle2 size={16} />
              <span>{task}</span>
              <strong>next</strong>
            </div>
          ))}
        </article>
      </section>
      {message ? <p className="dashboard-message">{message}</p> : null}
    </>
  );
}

function EmptyPanelLine({ text }: { text: string }) {
  return <p className="empty-line">{text}</p>;
}

function StudentTable({ students: rows }: { students: typeof students }) {
  return (
    <div className="student-table">
      <div className="table-head">
        <span>student</span>
        <span>phase</span>
        <span>resume</span>
        <span>match</span>
        <span>eta</span>
      </div>
      {rows.map((student) => (
        <article className="student-row" key={student.name}>
          <div>
            <strong>{student.name}</strong>
            <span>{student.branch} · {student.skills}</span>
          </div>
          <em>{student.status}</em>
          <span>{student.resume}</span>
          <b>{student.match}%</b>
          <span>{student.eta}</span>
        </article>
      ))}
    </div>
  );
}
