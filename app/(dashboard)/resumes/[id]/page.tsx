"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Resume, updateResume } from "@/lib/db";
import { useAuth } from "@/context/AuthContext";
import { debounce } from "@/lib/utils";


export default function ResumeEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'basics' | 'socials' | 'education' | 'experience' | 'certificates' | 'projects' | 'skills' | 'coCurricular'>('basics');


  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, "resumes", id as string), (docSnap) => {
      if (docSnap.exists()) {
        setResume({ id: docSnap.id, ...docSnap.data() } as Resume);
      } else {
        router.push("/resumes");
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id, router]);

  // Debounced update helper
  const debouncedUpdate = useCallback(
    debounce((data: Partial<Resume>) => {
      if (id) updateResume(id as string, data);
    }, 1000),
    [id]
  );

  const handleUpdate = (newData: any) => {
    if (!resume) return;
    const updated = { ...resume, ...newData };
    setResume(updated);
    debouncedUpdate(newData);
  };

  const handleSectionUpdate = (section: string, data: any) => {
    if (!resume) return;
    const newSections = { ...resume.sections, [section]: data };
    handleUpdate({ sections: newSections });
  };

  if (loading || !resume) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <div className="w-12 h-12 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-teal animate-pulse">synchronizing studio...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-[88px] flex overflow-hidden bg-surface">
      {/* Editor Section (Left) */}
      <div className="w-full md:w-1/2 overflow-y-auto px-8 py-12 border-r border-outline-variant/20 scrollbar-hide bg-surface-container-lowest/50 backdrop-blur-3xl">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12 flex justify-between items-end">
             <div className="flex-1 mr-8">
                <span className="text-brand-teal font-extrabold tracking-[0.4em] uppercase text-[9px] mb-3 block opacity-70">studio architecture</span>
                <input 
                  value={resume.title}
                  onChange={(e) => handleUpdate({ title: e.target.value })}
                  className="text-5xl font-black font-headline tracking-tighter text-on-surface bg-transparent border-none outline-none focus:ring-0 w-full p-0 placeholder:text-on-surface-variant/20"
                  placeholder="untitled structural v1"
                />
             </div>
             <div className="flex flex-col items-end gap-3">
                <button onClick={() => router.push("/resumes")} className="group flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant/30 text-[10px] font-black tracking-widest uppercase text-on-surface-variant hover:text-brand-teal hover:border-brand-teal transition-all">
                   <span className="material-symbols-outlined text-sm">arrow_back</span>
                   save & exit
                </button>
             </div>
          </div>


          {/* Bento Grid Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* 1. The Profile Bento (Basics) */}
            <BentoCard title="structural profile" className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormInput 
                  label="full name"
                  value={resume.sections.basics.name}
                  onChange={(val) => handleSectionUpdate('basics', { ...resume.sections.basics, name: val })}
                />
                <FormInput 
                  label="email address"
                  value={resume.sections.basics.email}
                  onChange={(val) => handleSectionUpdate('basics', { ...resume.sections.basics, email: val })}
                />
                <FormInput 
                  label="phone nexus"
                  value={resume.sections.basics.phone}
                  onChange={(val) => handleSectionUpdate('basics', { ...resume.sections.basics, phone: val })}
                />
                <FormInput 
                  label="location nexus"
                  value={resume.sections.basics.location}
                  onChange={(val) => handleSectionUpdate('basics', { ...resume.sections.basics, location: val })}
                />
              </div>
              <div className="mt-6">
                <label className="text-[9px] font-black tracking-[0.15em] uppercase text-on-surface-variant/50 ml-1">professional summary</label>
                <textarea 
                   rows={3}
                   className="w-full bg-black/5 mt-2 border border-outline-variant/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-brand-teal/10 focus:border-brand-teal/30 transition-all outline-none font-medium text-sm resize-none"
                   placeholder="a high-impact summary of your career trajectory..."
                   value={resume.sections.basics.summary}
                   onChange={(e) => handleSectionUpdate('basics', { ...resume.sections.basics, summary: e.target.value })}
                />
              </div>
            </BentoCard>

            {/* 2. Experience Bento */}
            <BentoCard title="professional timeline" className="lg:row-span-2">
              <div className="space-y-4">
                {resume.sections.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-4 rounded-xl border border-outline-variant/10 bg-black/5 group relative">
                    <button 
                      onClick={() => {
                        const l = [...resume.sections.experience]; l.splice(idx, 1); handleSectionUpdate('experience', l);
                      }}
                      className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                    <div className="grid grid-cols-1 gap-3">
                      <FormInput borderless label="company" value={exp.company} onChange={(v) => {
                        const l = [...resume.sections.experience]; l[idx].company = v; handleSectionUpdate('experience', l);
                      }} />
                      <div className="grid grid-cols-2 gap-2">
                        <FormInput borderless label="role" value={exp.role} onChange={(v) => {
                          const l = [...resume.sections.experience]; l[idx].role = v; handleSectionUpdate('experience', l);
                        }} />
                        <FormInput borderless label="dates" value={exp.dates} onChange={(v) => {
                          const l = [...resume.sections.experience]; l[idx].dates = v; handleSectionUpdate('experience', l);
                        }} />
                      </div>
                      <textarea 
                        className="w-full bg-transparent border-none outline-none focus:ring-0 text-[11px] leading-relaxed text-on-surface-variant font-medium mt-1"
                        placeholder="bullets (one per line)..."
                        rows={3}
                        value={(exp.bullets || []).join("\n")}
                        onChange={(e) => {
                          const l = [...resume.sections.experience];
                          l[idx].bullets = e.target.value.split("\n").filter(line => line.trim() !== "");
                          handleSectionUpdate('experience', l);
                        }}
                      />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    handleSectionUpdate('experience', [...resume.sections.experience, { id: Math.random().toString(), company: "", role: "", dates: "", bullets: [] }]);
                  }}
                  className="w-full py-3 border border-dashed border-brand-teal/20 rounded-xl text-[9px] font-bold uppercase tracking-widest text-brand-teal/60 hover:text-brand-teal hover:bg-brand-teal/5 transition-all"
                >
                  + structural experience
                </button>
              </div>
            </BentoCard>

            {/* 3. Projects Bento */}
            <BentoCard title="innovation nexus" className="lg:row-span-2">
              <div className="space-y-4">
                {(resume.sections.projects || []).map((proj, idx) => (
                  <div key={proj.id} className="p-4 rounded-xl border border-outline-variant/10 bg-black/5 group relative">
                    <button 
                      onClick={() => {
                        const l = [...(resume.sections.projects || [])]; l.splice(idx, 1); handleSectionUpdate('projects', l);
                      }}
                      className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                    <div className="grid grid-cols-1 gap-2">
                      <FormInput borderless label="project title" value={proj.title} onChange={(v) => {
                        const l = [...(resume.sections.projects || [])]; l[idx].title = v; handleSectionUpdate('projects', l);
                      }} />
                      <FormInput borderless label="link" value={proj.link || ""} onChange={(v) => {
                        const l = [...(resume.sections.projects || [])]; l[idx].link = v; handleSectionUpdate('projects', l);
                      }} />
                      <textarea 
                        className="w-full bg-transparent border-none outline-none focus:ring-0 text-[11px] leading-relaxed text-on-surface-variant font-medium"
                        placeholder="metrics (one per line)..."
                        rows={2}
                        value={(proj.bullets || []).join("\n")}
                        onChange={(e) => {
                          const l = [...(resume.sections.projects || [])];
                          l[idx].bullets = e.target.value.split("\n").filter(line => line.trim() !== "");
                          handleSectionUpdate('projects', l);
                        }}
                      />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    handleSectionUpdate('projects', [...(resume.sections.projects || []), { id: Math.random().toString(), title: "", link: "", description: "", bullets: [] }]);
                  }}
                  className="w-full py-3 border border-dashed border-brand-teal/20 rounded-xl text-[9px] font-bold uppercase tracking-widest text-brand-teal/60 hover:text-brand-teal hover:bg-brand-teal/5 transition-all"
                >
                  + structural project
                </button>
              </div>
            </BentoCard>

            {/* 4. Education & Skills (Multi-Module) */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
               <BentoCard title="academic foundation">
                  <div className="space-y-4">
                    {resume.sections.education.map((edu, idx) => (
                      <div key={edu.id} className="grid grid-cols-2 gap-2 p-3 bg-black/5 rounded-xl group relative">
                        <button onClick={() => {
                           const l = [...resume.sections.education]; l.splice(idx, 1); handleSectionUpdate('education', l);
                        }} className="absolute top-1 right-1 text-red-400 opacity-0 group-hover:opacity-100 transition-all"><span className="material-symbols-outlined text-xs">close</span></button>
                        <FormInput borderless label="school" value={edu.school} onChange={(v) => {
                          const l = [...resume.sections.education]; l[idx].school = v; handleSectionUpdate('education', l);
                        }} />
                        <FormInput borderless label="degree" value={edu.degree} onChange={(v) => {
                          const l = [...resume.sections.education]; l[idx].degree = v; handleSectionUpdate('education', l);
                        }} />
                        <FormInput borderless label="dates" value={edu.dates} onChange={(v) => {
                          const l = [...resume.sections.education]; l[idx].dates = v; handleSectionUpdate('education', l);
                        }} />
                        <FormInput borderless label="gpa" value={edu.gpa} onChange={(v) => {
                          const l = [...resume.sections.education]; l[idx].gpa = v; handleSectionUpdate('education', l);
                        }} />
                      </div>
                    ))}
                    <button onClick={() => handleSectionUpdate('education', [...resume.sections.education, { id: Math.random().toString(), school: "", degree: "", dates: "", gpa: "" }])} className="w-full py-2.5 border border-dashed border-brand-teal/20 rounded-xl text-[8px] font-black uppercase tracking-widest text-brand-teal/60 hover:text-brand-teal transition-all">+ add education</button>
                  </div>
               </BentoCard>

               <BentoCard title="technical nexus">
                  <div className="space-y-4">
                    {resume.sections.skills.map((skill, idx) => (
                      <div key={skill.id} className="p-3 bg-black/5 rounded-xl">
                        <FormInput borderless label="category" value={skill.category} onChange={(v) => {
                          const l = [...resume.sections.skills]; l[idx].category = v; handleSectionUpdate('skills', l);
                        }} />
                        <input 
                          className="w-full bg-transparent border-none focus:ring-0 text-[11px] font-medium text-on-surface-variant mt-1"
                          placeholder="skills (comma separated)..."
                          value={skill.items.join(", ")}
                          onChange={(e) => {
                            const l = [...resume.sections.skills];
                            l[idx].items = e.target.value.split(",").map(i => i.trim());
                            handleSectionUpdate('skills', l);
                          }}
                        />
                      </div>
                    ))}
                    <button onClick={() => handleSectionUpdate('skills', [...resume.sections.skills, { id: Math.random().toString(), category: "", items: [] }])} className="w-full py-2.5 border border-dashed border-brand-teal/20 rounded-xl text-[8px] font-black uppercase tracking-widest text-brand-teal/60 hover:text-brand-teal transition-all">+ add skill slot</button>
                  </div>
               </BentoCard>
            </div>

            {/* 5. Social & Credentials */}
            <BentoCard title="structural socials">
              <div className="flex flex-wrap gap-2">
                {(resume.sections.basics.socials || []).map((social, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-black/5 px-3 py-2 rounded-xl group">
                    <input className="bg-transparent border-none focus:ring-0 text-[10px] w-20 font-bold text-brand-teal uppercase" value={social.platform} onChange={(e) => {
                      const l = [...(resume.sections.basics.socials || [])]; l[idx].platform = e.target.value; handleSectionUpdate('basics', { ...resume.sections.basics, socials: l });
                    }} />
                    <input className="bg-transparent border-none focus:ring-0 text-[10px] w-32 font-medium" value={social.url} onChange={(e) => {
                      const l = [...(resume.sections.basics.socials || [])]; l[idx].url = e.target.value; handleSectionUpdate('basics', { ...resume.sections.basics, socials: l });
                    }} />
                    <button onClick={() => {
                        const l = [...(resume.sections.basics.socials || [])]; l.splice(idx, 1); handleSectionUpdate('basics', { ...resume.sections.basics, socials: l });
                    }} className="opacity-0 group-hover:opacity-100 text-red-400"><span className="material-symbols-outlined text-xs">close</span></button>
                  </div>
                ))}
                <button onClick={() => handleSectionUpdate('basics', { ...resume.sections.basics, socials: [...(resume.sections.basics.socials || []), { platform: "", url: "" }] })} className="px-4 py-2 border border-dashed border-brand-teal/20 rounded-xl text-[8px] font-black text-brand-teal/60 hover:text-brand-teal">+ link</button>
              </div>
            </BentoCard>

            {/* 6. Co-curricular / POR */}
            <BentoCard title="leadership & engagement">
               <div className="space-y-4">
                 {(resume.sections.coCurricular || []).map((item, idx) => (
                   <div key={item.id} className="p-3 bg-black/5 rounded-xl group relative">
                      <button onClick={() => {
                         const l = [...(resume.sections.coCurricular || [])]; l.splice(idx, 1); handleSectionUpdate('coCurricular', l);
                      }} className="absolute top-1 right-1 text-red-400 opacity-0 group-hover:opacity-100 transition-all"><span className="material-symbols-outlined text-xs">close</span></button>
                      <FormInput borderless label="role" value={item.role} onChange={(v) => {
                         const l = [...resume.sections.coCurricular]; l[idx].role = v; handleSectionUpdate('coCurricular', l);
                      }} />
                      <FormInput borderless label="organization" value={item.organization} onChange={(v) => {
                         const l = [...resume.sections.coCurricular]; l[idx].organization = v; handleSectionUpdate('coCurricular', l);
                      }} />
                   </div>
                 ))}
                 <button onClick={() => handleSectionUpdate('coCurricular', [...(resume.sections.coCurricular || []), { id: Math.random().toString(), role: "", organization: "", dates: "", bullets: [] }])} className="w-full py-2.5 border border-dashed border-brand-teal/20 rounded-xl text-[8px] font-black uppercase tracking-widest text-brand-teal/60 hover:text-brand-teal transition-all">+ add activity</button>
               </div>
            </BentoCard>

            {/* 7. Certificates Bento */}
            <BentoCard title="credentials & honors">
               <div className="space-y-4">
                 {(resume.sections.certificates || []).map((cert, idx) => (
                   <div key={cert.id} className="p-3 bg-black/5 rounded-xl group relative">
                      <button onClick={() => {
                         const l = [...(resume.sections.certificates || [])]; l.splice(idx, 1); handleSectionUpdate('certificates', l);
                      }} className="absolute top-1 right-1 text-red-400 opacity-0 group-hover:opacity-100 transition-all"><span className="material-symbols-outlined text-xs">close</span></button>
                      <FormInput borderless label="certificate" value={cert.name} onChange={(v) => {
                         const l = [...resume.sections.certificates]; l[idx].name = v; handleSectionUpdate('certificates', l);
                      }} />
                      <FormInput borderless label="issuer" value={cert.issuer} onChange={(v) => {
                         const l = [...resume.sections.certificates]; l[idx].issuer = v; handleSectionUpdate('certificates', l);
                      }} />
                   </div>
                 ))}
                 <button onClick={() => handleSectionUpdate('certificates', [...(resume.sections.certificates || []), { id: Math.random().toString(), name: "", issuer: "", date: "", link: "" }])} className="w-full py-2.5 border border-dashed border-brand-teal/20 rounded-xl text-[8px] font-black uppercase tracking-widest text-brand-teal/60 hover:text-brand-teal transition-all">+ add credential</button>
               </div>
            </BentoCard>

          </div>
        </div>
      </div>

      {/* Preview Section (Right) */}
      <div className="hidden md:block w-1/2 p-12 bg-surface-container-low/30 overflow-y-auto">
        <div className="bg-white shadow-2xl w-full min-h-[11in] rounded-sm p-16 origin-top scale-[0.9] hover:scale-100 transition-transform duration-500 mx-auto max-w-[8.5in] text-[#2c3e50] font-sans">
           {/* ATS Clean Header */}
           <div className="text-center pb-8 border-b border-gray-100">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">{resume.sections.basics.name || "YOUR NAME"}</h1>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-gray-600 font-medium">
                 {resume.sections.basics.email && <span>{resume.sections.basics.email}</span>}
                 {resume.sections.basics.phone && <span>• {resume.sections.basics.phone}</span>}
                 {resume.sections.basics.location && <span>• {resume.sections.basics.location}</span>}
                 {(resume.sections.basics.socials || []).map((s, i) => (
                   <span key={i}>• <a href={s.url} target="_blank" className="hover:text-brand-teal transition-colors underline decoration-gray-200">{s.platform}</a></span>
                 ))}
              </div>
           </div>

           {/* Professional Bio */}
           {resume.sections.basics.summary && (
             <div className="mt-8">
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-teal mb-3">professional summary</h4>
                <p className="text-[11px] leading-relaxed text-gray-700">{resume.sections.basics.summary}</p>
             </div>
           )}

           {/* Technical Skills */}
           {resume.sections.skills.length > 0 && (
             <div className="mt-8">
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-teal mb-4 border-b border-gray-50 pb-1">technical competencies</h4>
                <div className="space-y-2">
                  {resume.sections.skills.map(skill => (
                    <div key={skill.id} className="flex text-[11px]">
                       <span className="font-bold text-gray-800 min-w-[120px]">{skill.category}:</span>
                       <span className="text-gray-700">{skill.items.join(", ")}</span>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {/* Experience */}
           {resume.sections.experience.length > 0 && (
             <div className="mt-8">
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-teal mb-4 border-b border-gray-50 pb-1">professional experience</h4>
                <div className="space-y-6">
                  {resume.sections.experience.map(exp => (
                    <div key={exp.id}>
                       <div className="flex justify-between items-baseline mb-1">
                          <h5 className="text-[13px] font-bold text-gray-900">{exp.company}</h5>
                          <span className="text-[10px] font-semibold text-gray-500">{exp.dates}</span>
                       </div>
                       <div className="text-[11px] font-bold text-gray-700 italic mb-2">{exp.role}</div>
                       <ul className="list-disc ml-5 space-y-1">
                          {(exp.bullets || []).map((bullet, i) => (
                            <li key={i} className="text-[11px] text-gray-700 leading-relaxed pl-1">{bullet}</li>
                          ))}
                       </ul>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {/* Projects */}
           {(resume.sections.projects || []).length > 0 && (
             <div className="mt-8">
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-teal mb-4 border-b border-gray-50 pb-1">key project architecture</h4>
                <div className="space-y-6">
                  {(resume.sections.projects || []).map(proj => (
                    <div key={proj.id}>
                       <div className="flex justify-between items-baseline mb-1">
                          <h5 className="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                            {proj.title}
                            {proj.link && <span className="text-[9px] font-normal text-gray-400 font-mono">[{proj.link}]</span>}
                          </h5>
                       </div>
                       <ul className="list-disc ml-5 space-y-1">
                          {(proj.bullets || []).map((bullet, i) => (
                            <li key={i} className="text-[11px] text-gray-700 leading-relaxed pl-1">{bullet}</li>
                          ))}
                       </ul>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {/* Education */}
           {resume.sections.education.length > 0 && (
             <div className="mt-8">
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-teal mb-4 border-b border-gray-50 pb-1">academic foundation</h4>
                <div className="space-y-4">
                  {resume.sections.education.map(edu => (
                    <div key={edu.id} className="flex justify-between items-start">
                       <div>
                          <h5 className="text-[12px] font-bold text-gray-900">{edu.school}</h5>
                          <div className="text-[11px] text-gray-700">{edu.degree}</div>
                       </div>
                       <div className="text-right">
                          <div className="text-[10px] font-semibold text-gray-500">{edu.dates}</div>
                          {edu.gpa && <div className="text-[10px] font-bold text-brand-teal">{edu.gpa}</div>}
                       </div>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {/* Certificates */}
           {(resume.sections.certificates || []).length > 0 && (
             <div className="mt-8">
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-teal mb-4 border-b border-gray-50 pb-1">credentials & certifications</h4>
                <div className="grid grid-cols-2 gap-4">
                  {(resume.sections.certificates || []).map(cert => (
                    <div key={cert.id} className="text-[11px]">
                       <div className="font-bold text-gray-900">{cert.name}</div>
                       <div className="text-gray-600 italic">{cert.issuer} • {cert.date}</div>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {/* Co-curricular & POR */}
           {(resume.sections.coCurricular || []).length > 0 && (
             <div className="mt-8">
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-teal mb-4 border-b border-gray-50 pb-1">co-curricular & positions of responsibility</h4>
                <div className="space-y-4">
                  {(resume.sections.coCurricular || []).map(item => (
                    <div key={item.id}>
                       <div className="flex justify-between items-baseline mb-1">
                          <h5 className="text-[12px] font-bold text-gray-900">{item.role}</h5>
                          <span className="text-[10px] font-semibold text-gray-500">{item.dates}</span>
                       </div>
                       <div className="text-[11px] font-bold text-gray-700 italic mb-1">{item.organization}</div>
                       <ul className="list-disc ml-5 space-y-0.5">
                          {(item.bullets || []).map((bullet, i) => (
                            <li key={i} className="text-[11px] text-gray-700 leading-relaxed pl-1">{bullet}</li>
                          ))}
                       </ul>
                    </div>
                  ))}
                </div>
             </div>
           )}
        </div>
      </div>

    </div>
  );
}

function BentoCard({ title, children, className = "" }: any) {
  return (
    <div className={`bg-white/40 backdrop-blur-2xl border border-outline-variant/20 rounded-[2rem] p-6 shadow-sm flex flex-col group/card hover:shadow-xl hover:shadow-brand-teal/5 transition-all duration-500 overflow-hidden ${className}`}>
       <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-brand-teal mb-6 opacity-60 flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-brand-teal animate-pulse"></span>
          {title}
       </h4>
       <div className="flex-1">
          {children}
       </div>
    </div>
  );
}

function FormInput({ label, value, onChange, borderless = false }: any) {
  return (
    <div className={`group transition-all duration-300 ${!borderless && 'bg-black/[0.03] p-3 rounded-2xl border border-outline-variant/10 hover:border-brand-teal/30 focus-within:border-brand-teal/50 focus-within:bg-white/80 focus-within:shadow-md'}`}>
       <label className="text-[8px] font-black tracking-[0.15em] uppercase text-on-surface-variant/40 group-focus-within:text-brand-teal transition-colors">{label}</label>
       <input 
         value={value}
         onChange={(e) => onChange(e.target.value)}
         className="w-full bg-transparent border-none outline-none focus:ring-0 font-bold text-xs text-on-surface placeholder:text-on-surface-variant/20 tracking-tight mt-0.5"
         placeholder={`enter ${label}...`}
       />
    </div>
  );
}
