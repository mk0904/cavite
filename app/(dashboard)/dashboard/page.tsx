export default function DashboardPage() {
  return (
    <div className="w-full flex-grow flex flex-col">
      {/* header section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tight text-on-surface">welcome back, alex.</h1>
          <p className="text-on-surface-variant mt-2 font-label">your career trajectory is looking strong this week.</p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm font-label text-outline uppercase tracking-widest">oct 24, 2026</p>
          <p className="text-xl font-bold font-headline text-brand-teal">academic year 2026-27</p>
        </div>
      </div>

      {/* bento grid layout */}
      <div className="grid grid-cols-12 gap-6 pb-20">
        
        {/* stats row */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white/40 backdrop-blur-2xl border border-brand-teal/20 shadow-[0_0_15px_rgba(0,123,128,0.05)] p-8 rounded-[2rem] group hover:bg-white/60 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brand-teal/10 rounded-2xl">
                <span className="material-symbols-outlined text-brand-teal">send</span>
              </div>
              <span className="text-emerald-600 text-xs font-bold font-label flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full">
                <span className="material-symbols-outlined text-[10px]">trending_up</span> +12%
              </span>
            </div>
            <p className="text-outline text-sm font-label tracking-widest">applications</p>
            <h3 className="text-5xl font-black font-headline text-on-surface mt-2 tracking-tighter">24</h3>
          </div>
          
          <div className="bg-white/40 backdrop-blur-2xl border border-brand-teal/20 shadow-[0_0_15px_rgba(0,123,128,0.05)] p-8 rounded-[2rem] group hover:bg-white/60 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brand-teal/10 rounded-2xl">
                <span className="material-symbols-outlined text-brand-teal">star</span>
              </div>
              <span className="text-emerald-600 text-xs font-bold font-label flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full">
                <span className="material-symbols-outlined text-[10px]">trending_up</span> +4%
              </span>
            </div>
            <p className="text-outline text-sm font-label tracking-widest">shortlisted</p>
            <h3 className="text-5xl font-black font-headline text-on-surface mt-2 tracking-tighter">08</h3>
          </div>
          
          <div className="bg-white/40 backdrop-blur-2xl border border-brand-teal/20 shadow-[0_0_15px_rgba(0,123,128,0.05)] p-8 rounded-[2rem] group hover:bg-white/60 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brand-teal/10 rounded-2xl">
                <span className="material-symbols-outlined text-brand-teal">celebration</span>
              </div>
              <span className="text-slate-500 text-xs font-bold font-label flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
                <span className="material-symbols-outlined text-[10px]">horizontal_rule</span> 0%
              </span>
            </div>
            <p className="text-outline text-sm font-label tracking-widest">offers</p>
            <h3 className="text-5xl font-black font-headline text-on-surface mt-2 tracking-tighter">02</h3>
          </div>

        </div>

        {/* recent activity feed */}
        <div className="col-span-12 lg:col-span-8 bg-white/40 backdrop-blur-2xl border border-brand-teal/20 shadow-[0_0_15px_rgba(0,123,128,0.05)] p-8 rounded-[2rem]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black font-headline">recent activity</h3>
            <button className="text-brand-teal font-bold text-sm font-label flex items-center gap-1 hover:underline focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1 rounded-full px-2 py-1">
              view all <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="space-y-6">
            
            <div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/60 transition-all border-l-4 border-transparent hover:border-brand-teal">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-surface-container-high">
                <img alt="Google" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPWmwKBt_BTFjrnMu9lZ1lXJSwPhdZZbG_EVbgv2VyVvRfiZRbvlWx1fmi5ubAQwIKYZH6az5FmTnCtA5O8f_vf_HRjX-ewTB4hA2BBZuMQgVkJHeuh08WFx8uASjCuYX7A3rtcqa2FxfHtXXo2EYwtk1MxWY40oyP2s7DMR5FSFc8qy8Sk47nXLij8M4oJ0KG6PrgUrTy57x6qp6N69d584FlbhaNWi9wp7zF-Ben8mfkinwGWtt3YDO67-4dhwQz9VZ6_WWP9ew"/>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-on-surface">resume viewed by google</h4>
                <p className="text-sm text-on-surface-variant font-label">software engineering internship 2026</p>
              </div>
              <span className="text-xs text-outline font-label">2 hours ago</span>
            </div>

            <div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/60 transition-all border-l-4 border-transparent hover:border-brand-teal">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-surface-container-high">
                <img alt="Amazon" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDHCikVsjlY88ruEu7kZ8CVL4O9iYu5FCr6Hc6MhugwML0kpWJLe_-HdP9oSsF5EPhHYSxrS5FCyOHH_EICbZspBCtx3SruY8zrWrog9XoTmaYBuRwA8h2LTaAdJPGg1qIKDz6UiaNcNW8M6dD2xzhAYTm-4yenkbB34adV2NP2kM1TX4qi-Xtm1OLAhPQb4ps78PFi29Syg8LbumvmXQWKSi-WReh7te8GV0pmRuY1OfESLKbwAsp_9uy-YF_NkXONDOWb-3LleU"/>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-on-surface">applied to amazon</h4>
                <p className="text-sm text-on-surface-variant font-label">frontend developer role - seattle</p>
              </div>
              <span className="text-xs text-outline font-label">yesterday</span>
            </div>

            <div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/60 transition-all border-l-4 border-transparent hover:border-brand-teal">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-surface-container-high">
                <img alt="Netflix" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHI79HsxGCH4tO47PYnGB5zA9k2Wh5ns3VpFzL92hRx6IblEbZSoZRRRP2fYSQp1rllv8Mk02zQchlueAY81U0LBV6tfKi9yNnXBFrGKoVwSNx5Q6caqMmP5pyEJbHZQKSHyCALoiO1baz4MGCdjg_IULfWb8N7yskIyV42YaOCicWjaE-S-ELq91mYYiATvgAwiqGljxUODxINXH6JiWwTBrG3SdqVxjuZkw_SIxXOKP6L7zHmqhfFUpUZWgrnuFcoI4a0nuwerI"/>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-on-surface">interview requested: netflix</h4>
                <p className="text-sm text-on-surface-variant font-label">final round - product design</p>
              </div>
              <span className="text-xs text-outline font-label">3 days ago</span>
            </div>

          </div>
        </div>

        {/* upcoming deadlines sidebar */}
        <div className="col-span-12 lg:col-span-4 bg-white/40 backdrop-blur-2xl border border-brand-teal/20 shadow-[0_0_15px_rgba(0,123,128,0.05)] p-8 rounded-[2rem]">
          <h3 className="text-2xl font-black font-headline mb-8">upcoming deadlines</h3>
          <div className="space-y-4">
            
            <div className="p-6 bg-white/60 rounded-3xl border border-white/40 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black font-headline tracking-widest rounded-full">high priority</span>
                <span className="text-xs font-label text-outline">oct 30</span>
              </div>
              <h5 className="font-black text-lg text-on-surface leading-tight">ibm interview</h5>
              <p className="text-xs text-on-surface-variant font-label mt-1">virtual meeting • 10:00 am est</p>
            </div>
            
            <div className="p-6 bg-white/60 rounded-3xl border border-white/40 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-brand-teal/10 text-brand-teal text-[10px] font-black font-headline tracking-widest rounded-full">application</span>
                <span className="text-xs font-label text-outline">nov 02</span>
              </div>
              <h5 className="font-black text-lg text-on-surface leading-tight">spotify design chal.</h5>
              <p className="text-xs text-on-surface-variant font-label mt-1">submission deadline</p>
            </div>

            <div className="p-6 bg-white/60 rounded-3xl border border-white/40 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black font-headline tracking-widest rounded-full">networking</span>
                <span className="text-xs font-label text-outline">nov 05</span>
              </div>
              <h5 className="font-black text-lg text-on-surface leading-tight">tech career fair</h5>
              <p className="text-xs text-on-surface-variant font-label mt-1">grand hall • all day</p>
            </div>

          </div>
          <button className="w-full mt-6 py-4 rounded-full border border-brand-teal/30 text-brand-teal font-bold hover:bg-brand-teal/5 transition-all focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1 text-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span> add new deadline
          </button>
        </div>

        {/* featured resources horizontal bento */}
        <div className="col-span-12 bg-white/40 backdrop-blur-2xl border border-brand-teal/20 shadow-[0_0_15px_rgba(0,123,128,0.05)] p-10 rounded-[2rem] overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-lg">
              <h3 className="text-3xl font-black font-headline tracking-tighter leading-none mb-4">master your technical interviews.</h3>
              <p className="text-on-surface-variant font-label text-lg">access our curated database of interview questions from top silicon valley firms, verified by actual candidates.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-brand-teal text-white rounded-full font-bold hover:scale-105 transition-transform focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1">
                  get started
                </button>
                <button className="px-8 py-3 border border-brand-teal/30 text-brand-teal rounded-full font-bold hover:bg-brand-teal/5 focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1">
                  browse guides
                </button>
              </div>
            </div>
            <div className="flex-shrink-0 w-full md:w-[400px] h-[250px] rounded-3xl overflow-hidden shadow-2xl">
              <img alt="Study Space" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhW4YojUpS_f5zTyIoDRubeIqZ0wS4THz1XEakyeQ52py6eddbDqed8AqsZSC37gwFG4Ivwx3FDTu-mOnBZa0TqMQQ0Sr1oVkW0eB22VYKnLPGg4OyEev1B9cm26Mv943yhXxYXKt5tzop8GmBnUZ_OKOzfbOdjWJfxkSbudINzwrWn60mAyGq5QW0YQ7jnCwlCc6GO1YQXrH804HX8Sc9_Ff7rJdy20fwlqDyBzgbnYOT4waaAX1tLSo6dH2-yWy1FV3_wXl3jdk"/>
            </div>
          </div>
          {/* abstract accent */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-teal/20 rounded-full blur-[80px]"></div>
        </div>

      </div>

      {/* floating action for quick access */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-brand-teal text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1">
          <span className="material-symbols-outlined text-2xl">chat_bubble</span>
        </button>
      </div>
    </div>
  );
}
