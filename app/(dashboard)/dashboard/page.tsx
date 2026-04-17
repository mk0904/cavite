"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  listenToApplications, 
  listenToAllJobs, 
  listenToActivity, 
  Application, 
  Job, 
  Activity 
} from "@/lib/db";

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const isAdmin = profile?.role === "admin";
  const firstName = profile?.name ? profile.name.split(" ")[0].toLowerCase() : "architect";

  const [apps, setApps] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevDay = () => {
    setSelectedDate(prev => new Date(prev.setDate(prev.getDate() - 1)));
  };
  const handleNextDay = () => {
    setSelectedDate(prev => new Date(prev.setDate(prev.getDate() + 1)));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  useEffect(() => {
    if (!user) return;
    const unsubApps = listenToApplications(user.uid, setApps);
    const unsubJobs = listenToAllJobs(setJobs);
    const unsubActivity = listenToActivity(setActivities);
    setLoading(false);
    return () => {
      unsubApps();
      unsubJobs();
      unsubActivity();
    };
  }, [user]);

  // Mock Timeline Data for demonstration
  const timelineEvents = [
    { name: "Robotics Lab", type: "Lecture", time: "2:30 PM - 4:30 PM", date: new Date() },
    { name: "IBM System Audit", type: "Verification Review", time: "14:00 - 15:30", date: new Date(new Date().setDate(new Date().getDate() + 1)) },
    { name: "DL", type: "Lecture", time: "8:30 AM - 10:00 AM", date: new Date(new Date().setDate(new Date().getDate() + 3)) },
    { name: "ADM", type: "Lecture", time: "10:00 AM - 11:30 AM", date: new Date(new Date().setDate(new Date().getDate() + 3)) },
  ];

  const filteredEvents = timelineEvents.filter(e => 
    e.date.getDate() === selectedDate.getDate() &&
    e.date.getMonth() === selectedDate.getMonth() &&
    e.date.getFullYear() === selectedDate.getFullYear()
  );

  const stats = isAdmin
    ? [
        { label: "openings", value: jobs.filter(j => j.status === 'open').length.toString(), sub: "market", icon: "work" },
        { label: "apps", value: apps.length.toString(), sub: "telemetry", icon: "analytics" },
        { label: "yield", value: "94%", sub: "optimal", icon: "verified" }
      ]
    : [
        { label: "pursuits", value: apps.length.toString(), sub: "active", icon: "architecture" },
        { label: "shortlists", value: apps.filter(a => a.status === 'shortlisted').length.toString(), sub: "precision", icon: "star_rate" },
        { label: "offers", value: apps.filter(a => a.status === 'offer' || a.status === 'placed').length.toString(), sub: "final", icon: "celebration" }
      ];

  // Calendar Logic
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const currentDay = today.getDate();

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-8 h-8 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin"></div>
      <p className="text-[8px] font-black uppercase tracking-widest text-brand-teal animate-pulse">synchronizing bento telemetry...</p>
    </div>
  );

  return (
    <div className="w-full flex flex-col relative">
      
      {/* 1. Global Floating Action Hub (Top-Right) */}
      <div className="fixed top-8 right-12 z-[60] flex items-center gap-2 bg-white/40 backdrop-blur-3xl border border-white/60 p-1.5 rounded-2xl shadow-2xl">
         <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant/40 hover:text-brand-teal hover:bg-brand-teal/5 rounded-xl transition-all relative">
            <span className="material-symbols-outlined text-xl">notifications</span>
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
         </button>
         <div className="w-px h-6 bg-outline-variant/10 mx-1"></div>
         <div className="flex items-center gap-3 pl-1 pr-3 py-1">
            <div className="w-8 h-8 rounded-xl border border-white overflow-hidden shadow-sm">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full bg-brand-teal/10 flex items-center justify-center text-brand-teal/40">
                      <span className="material-symbols-outlined text-base">person</span>
                   </div>
                )}
            </div>
            <div className="hidden md:block">
               <p className="text-[9px] font-bold text-on-surface lowercase tracking-tight leading-none">{profile?.name?.split(" ")[0] || "User"}</p>
               <p className="text-[7px] font-semibold text-brand-teal lowercase tracking-wider opacity-60 mt-1">{profile?.role || "analyst"}</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-12 gap-3 mb-12">
        
        {/* LEFT COLUMN: PRIMARY BENTO (9/12) - Flat Registry Focus */}
        <div className="col-span-12 lg:col-span-9 space-y-3">
           
           <h1 className="text-3xl font-bold font-headline tracking-tighter text-on-surface leading-tight px-2">
              welcome, <span className="text-brand-teal italic font-light lowercase">{firstName}.</span>
           </h1>

           {/* Metrics Row (Flat Tiles) */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-outline-variant/5 flex items-center justify-between transition-colors hover:bg-white/50">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-brand-teal/5 flex items-center justify-center text-brand-teal">
                        <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                      </div>
                      <div>
                         <p className="text-[8px] font-bold lowercase tracking-wider text-on-surface-variant/40">{stat.label}</p>
                         <h3 className="text-xl font-bold font-headline text-on-surface leading-none mt-1">{stat.value}</h3>
                      </div>
                   </div>
                   <span className="text-[7px] font-bold lowercase text-brand-teal/40 tracking-widest">{stat.sub}</span>
                </div>
              ))}
           </div>

           {/* Active Pipelines (Flat Tile) */}
           <div className="bg-white p-6 rounded-[2.5rem] border border-outline-variant/5 flex flex-col min-h-[500px]">
              <div className="flex justify-between items-center mb-10 px-2">
                 <div>
                    <h3 className="text-sm font-bold font-headline tracking-tighter lowercase text-on-surface">active pursuit pipelines.</h3>
                    <p className="text-[8px] text-on-surface-variant/40 font-bold lowercase tracking-widest mt-0.5">real-time documentation status</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-8 h-px bg-outline-variant/10"></span>
                    <Link href="/jobs" className="text-[8px] font-bold text-brand-teal hover:bg-brand-teal/5 transition-all px-3 py-2 rounded-full lowercase tracking-widest">market gallery</Link>
                 </div>
              </div>

              <div className="space-y-1.5 flex-1 pr-1">
                 {apps.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-outline-variant/10 rounded-[2rem] bg-surface/30">
                       <p className="text-[8px] font-bold text-on-surface-variant/20 lowercase tracking-[0.4em]">awaiting structural synchronization</p>
                    </div>
                 ) : (
                    apps.map((app, i) => (
                       <div key={i} className="flex items-center gap-4 p-4 hover:bg-surface rounded-2xl border border-transparent hover:border-outline-variant/10 transition-all group">
                          <div className="w-10 h-10 bg-on-surface/5 rounded-xl flex items-center justify-center text-on-surface group-hover:bg-brand-teal group-hover:text-white transition-all">
                             <span className="material-symbols-outlined text-lg">layers</span>
                          </div>
                          <div className="flex-1">
                             <h4 className="text-[11px] font-bold text-on-surface lowercase tracking-tight">{app.jobTitle.toLowerCase()}</h4>
                             <p className="text-[8px] font-semibold text-on-surface-variant/40 lowercase tracking-widest mt-0.5">{app.companyName.toLowerCase()}</p>
                          </div>
                          <div className="flex items-center gap-4 text-right">
                             <div className={`px-2.5 py-1 rounded-full border ${app.status === 'offer' ? 'bg-green-50/50 border-green-100' : 'bg-brand-teal/[0.03] border-brand-teal/5'}`}>
                                <span className={`text-[8px] font-bold lowercase tracking-widest ${app.status === 'offer' ? 'text-green-600/60' : 'text-brand-teal/60'}`}>{app.status}</span>
                             </div>
                             <span className="text-[8px] font-bold text-on-surface-variant/20 tracking-tighter w-12">{new Date(app.appliedAt?.toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>

        </div>

        {/* RIGHT COLUMN: INSTITUTIONAL REGISTRY (Interactive Timeline Explorer) */}
        <div className="col-span-12 lg:col-span-3">
           <div className="bg-white border border-outline-variant/5 rounded-[2.5rem] p-8 sticky top-4 h-fit">
              
              {/* Header with Navigation */}
              <div className="flex flex-col gap-6 mb-10">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold font-headline text-on-surface">calendar.</h3>
                    <div className="flex items-center gap-1">
                       <button onClick={handlePrevDay} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface border border-outline-variant/5 text-on-surface-variant/40 transition-all">
                          <span className="material-symbols-outlined text-sm">chevron_left</span>
                       </button>
                       <button onClick={handleNextDay} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface border border-outline-variant/5 text-on-surface-variant/40 transition-all">
                          <span className="material-symbols-outlined text-sm">chevron_right</span>
                       </button>
                    </div>
                 </div>
                 <p className="text-[10px] font-bold lowercase text-on-surface-variant/30 tracking-widest mt-[-20px]">your schedule for the next days</p>
              </div>

              {/* Day Highlights */}
              <div className="space-y-6">
                 {isToday(selectedDate) && (
                    <div className="p-4 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl shadow-lg shadow-orange-500/20">
                       <p className="text-[11px] font-bold text-white lowercase tracking-tight">you have {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} today</p>
                    </div>
                 )}

                 {/* The Day Pill & Events */}
                 <div className="pt-4 border-t border-outline-variant/5">
                    <div className="flex gap-6">
                       {/* Date Pill (Blue Capsule) */}
                       <div className="w-12 h-16 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-blue-600 shrink-0 border border-blue-100 shadow-sm shadow-blue-500/5">
                          <span className="text-[14px] font-bold leading-none">{selectedDate.getDate()}</span>
                          <span className="text-[9px] font-black uppercase tracking-tighter mt-1">{selectedDate.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                       </div>

                       {/* Events list for the day */}
                       <div className="flex-1 space-y-8">
                          {filteredEvents.length === 0 ? (
                             <div className="py-2 opacity-20">
                                <p className="text-[10px] font-bold lowercase italic">no sessions scheduled.</p>
                             </div>
                          ) : (
                             filteredEvents.map((event, i) => (
                                <div key={i} className="group">
                                   <p className="text-[10px] font-bold text-on-surface-variant/30 lowercase tracking-widest">{event.name}</p>
                                   <h4 className="text-[15px] font-bold text-on-surface mt-1 lowercase tracking-tight">{event.type}</h4>
                                   <p className="text-[10px] font-bold text-on-surface-variant/40 mt-1 uppercase tracking-tighter">{event.time}</p>
                                   {i < filteredEvents.length - 1 && <div className="mt-8 border-t border-outline-variant/5 w-full"></div>}
                                </div>
                             ))
                          )}
                       </div>
                    </div>
                 </div>

                 {/* Registry Archive Refined */}
                 <div className="mt-14 pt-8 border-t border-outline-variant/5">
                    <button className="w-full h-12 border border-outline-variant/10 text-on-surface-variant/40 rounded-2xl flex items-center justify-center gap-2 hover:bg-surface transition-all">
                       <span className="text-[10px] font-bold lowercase tracking-widest px-4">view full registry</span>
                       <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    </button>
                 </div>
              </div>

           </div>
        </div>

      </div>

    </div>
  );
}