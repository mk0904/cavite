import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* top navigation */}
      <header className="fixed top-6 left-0 right-0 z-50 mx-auto max-w-4xl px-4 w-full">
        <nav className="flex justify-between items-center px-6 py-3 w-full bg-white/30 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_rgba(31,38,135,0.07)] font-body">
          <div className="text-xl font-extrabold tracking-tighter text-brand-teal pr-6">
            cavite.
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a
              className="text-on-surface/80 hover:text-brand-teal font-medium transition-colors text-sm"
              href="#"
            >
              features
            </a>
            <a
              className="text-on-surface/80 hover:text-brand-teal font-medium transition-colors text-sm"
              href="#"
            >
              how it works
            </a>
            <a
              className="text-on-surface/80 hover:text-brand-teal font-medium transition-colors text-sm"
              href="#"
            >
              about
            </a>
          </div>
          <div className="flex gap-4 items-center pl-6">
            <button className="hidden sm:block text-sm font-semibold text-on-surface/70 hover:text-brand-teal transition-all">
              log in
            </button>
            <Link href="/sign-up">
              <button className="px-6 py-2 text-sm font-bold bg-brand-teal text-white rounded-full hover:opacity-90 transition-all shadow-lg shadow-brand-teal/20">
                sign up
              </button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* hero section */}
        <section className="relative pt-48 pb-32 px-8 md:px-20 max-w-full overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full -z-10 opacity-10">
            <div className="w-full h-full bg-gradient-to-bl from-brand-teal to-transparent transform skew-x-12 translate-x-32"></div>
          </div>
          <div className="editorial-grid max-w-7xl mx-auto">
            <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
              <span className="text-brand-teal font-bold tracking-[0.2em] mb-8 text-xs">
                professional infrastructure
              </span>
              <h1 className="text-6xl md:text-8xl text-on-surface tracking-tighter leading-[0.95] mb-10">
                architect your <br />
                <span className="text-brand-teal">professional future.</span>
              </h1>
              <p className="text-xl md:text-2xl text-on-surface-variant max-w-xl leading-relaxed mb-12 font-light">
                a placement ecosystem designed with structural integrity. we
                bridge the gap between ambition and institutional excellence.
              </p>
              <div className="flex flex-wrap gap-6">
                <button className="px-10 py-5 bg-brand-teal text-white rounded-full font-bold text-lg flex items-center gap-3 hover:opacity-90 transition-all shadow-2xl shadow-brand-teal/20 focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1">
                  build your blueprint{" "}
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>
                <button className="px-10 py-5 bg-white text-on-surface border border-outline-variant/30 rounded-full font-bold text-lg hover:bg-surface-container-low transition-all focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1">
                  explore talent
                </button>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5 relative mt-12 lg:mt-0">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-3xl">
                <img
                  alt="modern architectural interior"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2OUlJFMfTnLzyAeM65zdGGf2Q9SDjXBTt_tCxH8qx6-uMjVZ7sL-CJr9q2TMw-aX9wljRr5uq9zNFAGuPYdleTRkfQOUGbwojA_feGckjiFX7fQokVVAl6oCECTaVkDgDw-Sz35JNz40Kj5mBfMHQ7TfcHDwOcQgdePphckIvw9LohR1rh20xchWJOUwkXokktMjUKaQiSyfZ4UA-DiLAEy-nDEDt1XYQ3a82MsUCuqH3R9BEKbqTfouR-SArWkcgULwZLxLLTmA"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 glass-panel p-10 rounded-2xl shadow-2xl border border-white/40 max-w-[280px]">
                <div className="text-brand-teal font-extrabold text-5xl mb-2">
                  94%
                </div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant">
                  placement velocity q4
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* partners */}
        <section className="bg-surface-container-low/50 py-20">
          <div className="max-w-7xl mx-auto px-8">
            <p className="text-center text-on-surface-variant font-bold text-xs tracking-[0.3em] mb-16 opacity-60">
              trusted by global design & tech powerhouses
            </p>
            <div className="flex flex-wrap justify-between items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="text-3xl font-extrabold tracking-tighter">
                studio_x
              </div>
              <div className="text-3xl font-light italic">vertex</div>
              <div className="text-3xl font-black tracking-tighter">
                linear
              </div>
              <div className="text-3xl font-mono tracking-tighter">foundry_</div>
              <div className="text-3xl font-medium tracking-[0.2em]">nova</div>
            </div>
          </div>
        </section>

        {/* 1. transparency section (the glass pipeline) */}
        <section className="py-40 px-8 md:px-20 max-w-full bg-white">
          <div className="editorial-grid max-w-7xl mx-auto">
            <div className="col-span-12 lg:col-span-5 flex flex-col justify-center mb-16 lg:mb-0">
              <span className="text-brand-teal font-bold tracking-[0.2em] mb-8 text-xs">
                transparency first
              </span>
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-10 leading-tight text-on-surface">
                the glass pipeline.
              </h2>
              <p className="text-xl text-on-surface-variant leading-relaxed mb-12 font-light">
                eliminating the 'black box' of recruitment. experience real-time
                telemetry of your application status within our architectural
                framework.
              </p>
              <div className="space-y-10">
                <div className="flex items-start gap-6">
                  <div className="w-1.5 h-16 bg-brand-teal/20 rounded-full mt-1"></div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">live status tracking</h4>
                    <p className="text-on-surface-variant font-light leading-relaxed">
                      instant updates from 'applied' to 'offer' with high-fidelity
                      stage details.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-1.5 h-16 bg-outline-variant/40 rounded-full mt-1"></div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">feedback loops</h4>
                    <p className="text-on-surface-variant font-light leading-relaxed">
                      our pipeline ensures every candidate receives structural
                      feedback within 48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <div className="glass-panel rounded-3xl p-10 md:p-14 border border-outline-variant/10 shadow-3xl overflow-hidden relative">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-12 pb-10 border-b border-on-surface/5">
                    <div>
                      <div className="flex gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-400/40"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400/40"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400/40"></div>
                      </div>
                      <h3 className="text-2xl font-extrabold tracking-tight">
                        applications pulse
                      </h3>
                      <p className="text-[10px] text-brand-teal font-bold tracking-[0.2em] mt-1">
                        live telemetry dashboard
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-brand-teal/5 px-4 py-2 rounded-full">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50"></span>
                      <span className="text-[10px] font-bold text-brand-teal tracking-widest">
                        live feed
                      </span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 p-6 bg-white/60 rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 bg-brand-teal/10 rounded-full flex items-center justify-center text-brand-teal">
                        <span className="material-symbols-outlined text-2xl">
                          architecture
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-lg">
                          senior designer @ studio_x
                        </h5>
                        <p className="text-xs text-on-surface-variant font-medium">
                          stage 4: final interview scheduled
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-md tracking-widest">
                        success
                      </span>
                    </div>
                    <div className="flex items-center gap-6 p-6 bg-white/90 rounded-2xl border border-white shadow-lg ring-1 ring-brand-teal/5">
                      <div className="w-14 h-14 bg-secondary-container rounded-full flex items-center justify-center text-brand-teal">
                        <span className="material-symbols-outlined text-2xl">
                          hourglass_empty
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-lg">bim specialist @ linear</h5>
                        <p className="text-xs text-on-surface-variant font-medium">
                          stage 2: technical review
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-brand-teal/10 text-brand-teal text-[10px] font-bold rounded-md tracking-widest">
                        in progress
                      </span>
                    </div>
                    <div className="flex items-center gap-6 p-6 bg-white/40 rounded-2xl border border-white/50 opacity-60">
                      <div className="w-14 h-14 bg-surface-variant rounded-full flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-2xl">
                          lock
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-lg">
                          project architect @ foundry_
                        </h5>
                        <p className="text-xs text-on-surface-variant font-medium">
                          pending interview clearance
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-on-surface-variant/10 text-on-surface-variant text-[10px] font-bold rounded-md tracking-widest">
                        locked
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-teal/5 blur-[100px] rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ecosystem section (institutional ecosystem) */}
        <section className="bg-surface-container-low/30 py-40">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-24">
              <span className="text-brand-teal font-bold tracking-[0.2em] mb-6 block text-xs">
                comprehensive ecosystem
              </span>
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface">
                foundational engineering.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="group cursor-pointer">
                <div className="aspect-video rounded-3xl overflow-hidden mb-10 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  <img
                    alt="resume blueprinting"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuApt6uhODzG4mtxQk1cawpKTRCmHrke2gNG7yQQNoQL35hVvz9cMTt2EnudKQY3YN3eC23oFjEeD7Jp1nGfTrA92fwe0o0YjFszxPZN4VRGWueLimuTFQ5-ITAUHWWjs3PSqQlQWMP4SXtQa5fRoj651mv5Qg3GU-bODghYEAHxxC_ALoqGWG6SngwHht0JNja4Q1h0yTMeoWmPNORPuXJ4I99vddyhY-WEA98KCdw3Z7VGyoOjyKW7x-LJNlhu7iELs4HBDTTgBVY"
                  />
                </div>
                <h3 className="text-3xl font-extrabold mb-5 text-brand-teal">
                  resume blueprinting
                </h3>
                <p className="text-on-surface-variant leading-relaxed text-lg font-light mb-8 max-w-lg">
                  we don't just write resumes; we engineer them. using our
                  proprietary structural logic, your narrative is reconstructed for
                  maximum institutional impact.
                </p>
                <a
                  className="text-brand-teal font-extrabold text-sm tracking-widest flex items-center gap-3 group-hover:gap-5 transition-all"
                  href="#"
                >
                  explore methodology{" "}
                  <span className="material-symbols-outlined text-xl">
                    arrow_right_alt
                  </span>
                </a>
              </div>
              <div className="group cursor-pointer mt-0 md:mt-24">
                <div className="aspect-video rounded-3xl overflow-hidden mb-10 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  <img
                    alt="structural interviews"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAva8dDCD4FGFMdnHDrd_vHxv9BN0cbnDxEFVq8LnNeAEDvPVu3BpVD8cEvcloJnwGoyhr7x49IvWbaAWz6mHpUq9huyh0E2sYUwBodsIVWEMr5zJL8qRONC333DvMIoEbmtUuSnFZ7OK-m2T0zp0WAVOuH-2AYXaPidMYsLb8rBBA8TmSLPUOlliZqlnRJ2HEirZ6MLmKk7nmYtD-XbTN0lXm5V6IJiJmyyExgd7AfArVXJ_tIbE6PFxmLzPyCXzP2CAuOpEeCOro"
                  />
                </div>
                <h3 className="text-3xl font-extrabold mb-5 text-brand-teal">
                  structural interviews
                </h3>
                <p className="text-on-surface-variant leading-relaxed text-lg font-light mb-8 max-w-lg">
                  simulated environments that mirror the intensity of high-tier
                  firms. every session is recorded and analyzed with architectural
                  precision.
                </p>
                <a
                  className="text-brand-teal font-extrabold text-sm tracking-widest flex items-center gap-3 group-hover:gap-5 transition-all"
                  href="#"
                >
                  learn about scenarios{" "}
                  <span className="material-symbols-outlined text-xl">
                    arrow_right_alt
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3. admin section (the command center) */}
        <section className="bg-[#191c1d] text-white py-40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 editorial-grid">
            <div className="col-span-12 lg:col-span-5 mb-20 lg:mb-0">
              <span className="text-brand-teal font-bold tracking-[0.2em] mb-8 text-xs block">
                admin operations
              </span>
              <h2 className="text-6xl md:text-7xl font-extrabold tracking-tighter mb-12 leading-none">
                the command center.
              </h2>
              <div className="space-y-16">
                <div className="asymmetric-border pl-10 group">
                  <div className="flex items-center gap-4 mb-3 text-brand-teal">
                    <span className="material-symbols-outlined text-3xl">speed</span>
                    <h4 className="text-2xl font-extrabold text-white">
                      placement velocity
                    </h4>
                  </div>
                  <p className="text-white/50 font-light text-lg leading-relaxed max-w-sm">
                    monitor entire departments or graduating classes with
                    aggregated performance heatmaps.
                  </p>
                </div>
                <div className="asymmetric-border pl-10 group">
                  <div className="flex items-center gap-4 mb-3 text-brand-teal">
                    <span className="material-symbols-outlined text-3xl">
                      analytics
                    </span>
                    <h4 className="text-2xl font-extrabold text-white">
                      cohort analytics
                    </h4>
                  </div>
                  <p className="text-white/50 font-light text-lg leading-relaxed max-w-sm">
                    deep-dive metrics into skill-gap analysis and industry demand
                    trends.
                  </p>
                </div>
              </div>
              <button className="mt-16 px-10 py-5 bg-white text-on-surface rounded-full font-bold text-lg hover:bg-brand-teal hover:text-white transition-all shadow-2xl shadow-white/5 focus:outline-none focus:ring-1 focus:ring-brand-teal focus:ring-offset-1 focus:ring-offset-[#002021]">
                request admin access
              </button>
            </div>
            <div className="col-span-12 lg:col-span-7 relative">
              {/* glassmorphism dashboard preview */}
              <div className="glass-dark border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-3xl relative z-10">
                <div className="flex justify-between items-start mb-16">
                  <div>
                    <p className="text-white/30 text-[10px] font-bold tracking-[0.3em] mb-3">
                      dashboard / analytics
                    </p>
                    <h3 className="text-4xl font-extrabold tracking-tight">
                      active pulse metrics
                    </h3>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-12 h-1 bg-brand-teal rounded-full shadow-[0_0_15px_rgba(0,123,128,0.4)]"></div>
                    <div className="w-8 h-1 bg-white/10 rounded-full"></div>
                    <div className="w-4 h-1 bg-white/10 rounded-full"></div>
                  </div>
                </div>
                {/* high-end data vis mockup */}
                <div className="h-64 w-full flex items-end justify-between gap-6 px-4 mb-16">
                  <div className="bg-brand-teal/10 w-full rounded-t-xl h-[30%]"></div>
                  <div className="bg-brand-teal/20 w-full rounded-t-xl h-[50%]"></div>
                  <div className="bg-brand-teal/40 w-full rounded-t-xl h-[85%]"></div>
                  <div className="bg-brand-teal w-full rounded-t-xl h-[65%] relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-on-surface text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                      peak
                    </div>
                  </div>
                  <div className="bg-brand-teal/30 w-full rounded-t-xl h-[45%]"></div>
                  <div className="bg-brand-teal/60 w-full rounded-t-xl h-[95%]"></div>
                  <div className="bg-brand-teal/15 w-full rounded-t-xl h-[40%]"></div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                    <span className="text-white/30 text-xs font-bold tracking-widest block mb-2">
                      active offers
                    </span>
                    <span className="text-5xl font-extrabold tracking-tighter">
                      1,248
                    </span>
                  </div>
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                    <span className="text-white/30 text-xs font-bold tracking-widest block mb-2">
                      efficiency
                    </span>
                    <span className="text-5xl font-extrabold tracking-tighter text-brand-teal">
                      +24%
                    </span>
                  </div>
                </div>
              </div>
              {/* decorative element */}
              <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-brand-teal/10 blur-[150px] rounded-full -z-0"></div>
            </div>
          </div>
        </section>

        {/* 4. testimonials */}
        <section className="py-40 px-8 md:px-20 max-w-7xl mx-auto">
          <div className="editorial-grid">
            <div className="col-span-12 lg:col-span-4 flex flex-col justify-center">
              <h2 className="text-5xl font-extrabold tracking-tighter mb-8 leading-tight">
                built on <br />
                success.
              </h2>
              <p className="text-xl text-on-surface-variant font-light leading-relaxed">
                hear from the architects and designers who leveraged our structural
                advantage to secure their career foundation.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-10 rounded-[2.5rem] bg-surface-container-low/50 border border-outline-variant/10 relative overflow-hidden group">
                <p className="text-xl font-light italic text-on-surface mb-10 leading-relaxed relative z-10">
                  "the architectural approach to my portfolio was a game changer. i
                  didn't just find a job; i found my career's foundation."
                </p>
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 bg-surface-dim rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shadow-lg">
                    <img
                      alt="profile"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuALNHe4n48SAvDyRj-8DIz8-LPct33kxuDVxWN1OJ-w-WHlhNkeC4kxYtjG5nP-ty7lPhEp87pLicJdGPJfi2qmrlEjVRnFwBxiZp4ZUii2v5JDDGdNdb2KMY5YMXjRSp9W0wc59U1Gi-07jpIa6OluiFHabvnRdbC1ERExq3mHrm7QdW0yzo2rX7B7iOwnIqxzxFfdwO8tjcY8OZEiPkgCM-WX7TKtgLqKgMyTPTFpbh1jyh5ovf_xc707vIh5NwRq0qR83ChGP6A"
                    />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-lg">elena vance</h5>
                    <p className="text-[10px] text-brand-teal font-bold tracking-[0.2em]">
                      senior ux engineer
                    </p>
                  </div>
                </div>
                <span
                  className="material-symbols-outlined text-[120px] text-brand-teal/5 absolute -top-4 -right-4 pointer-events-none"
                  data-icon="format_quote"
                >
                  format_quote
                </span>
              </div>
              <div className="p-10 rounded-[2.5rem] bg-white border border-outline-variant/10 shadow-xl shadow-brand-teal/5 relative overflow-hidden group">
                <p className="text-xl font-light italic text-on-surface mb-10 leading-relaxed relative z-10">
                  "cavite provides a level of clarity that simply doesn't exist
                  elsewhere. the telemetry dashboard kept me calm and focused."
                </p>
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 bg-brand-teal/10 rounded-full flex items-center justify-center text-brand-teal shadow-inner">
                    <span className="material-symbols-outlined text-2xl">
                      person
                    </span>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-lg">marcus aurelius</h5>
                    <p className="text-[10px] text-brand-teal font-bold tracking-[0.2em]">
                      data architect
                    </p>
                  </div>
                </div>
                <span
                  className="material-symbols-outlined text-[120px] text-brand-teal/5 absolute -top-4 -right-4 pointer-events-none"
                  data-icon="format_quote"
                >
                  format_quote
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* final cta */}
        <section className="pb-40 px-8 max-w-7xl mx-auto">
          <div className="relative rounded-[3rem] py-32 px-12 overflow-hidden bg-brand-teal text-white text-center">
            <div className="absolute inset-0 opacity-10 mix-blend-overlay">
              <img
                alt="abstract texture"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3XcaQKis6ETC4e7I487RuU74zBS3OOvQOHQkuw9FCYSuPm35zdz4RSJO1fimC6l1Y3q0PpMeeVSrZPjk2QA2jLKIifcyz-h1FbhV58lOXRwJGxB39B5tQ0KmWG_Xcvc2Vw-JWIwGoiMz6vas5G8FLUNGWINTs21GtDoNICssf4w-dfzpuhIWvj2UwGqiDQLNWRIepQXZocBXodiD3ujd7DZbcaRpJW4W1Xt_jF0Igr0EpMp08fmLZeql1GcTcMKMnLwbXIKgFC5c"
              />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-10">
                ready to build?
              </h2>
              <p className="text-xl md:text-2xl text-white/80 font-light mb-16 leading-relaxed">
                join the next cohort of professionals who are redefining
                institutional excellence through structural placement.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button className="px-12 py-6 bg-white text-brand-teal rounded-full font-extrabold text-xl shadow-2xl hover:bg-surface-container-low transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-brand-teal">
                  apply for intake 2024
                </button>
                <button className="px-12 py-6 bg-transparent text-white border-2 border-white/30 rounded-full font-extrabold text-xl hover:bg-white/10 transition-all focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-brand-teal">
                  view curriculum
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* footer */}
      <footer className="w-full py-20 bg-surface-container-low border-t border-outline-variant/10 font-body">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
            <div className="md:col-span-4">
              <div className="text-3xl font-extrabold tracking-tighter text-brand-teal mb-8">
                cavite
              </div>
              <p className="text-on-surface-variant font-bold text-xs tracking-[0.2em] leading-loose">
                architectural modernism applied <br /> to the career lifecycle.
              </p>
            </div>
            <div className="md:col-span-2">
              <h6 className="text-xs font-bold tracking-widest text-on-surface mb-8">
                navigation
              </h6>
              <ul className="space-y-4">
                <li>
                  <a
                    className="text-on-surface-variant hover:text-brand-teal transition-colors text-sm font-medium"
                    href="#"
                  >
                    portfolios
                  </a>
                </li>
                <li>
                  <a
                    className="text-on-surface-variant hover:text-brand-teal transition-colors text-sm font-medium"
                    href="#"
                  >
                    placements
                  </a>
                </li>
                <li>
                  <a
                    className="text-on-surface-variant hover:text-brand-teal transition-colors text-sm font-medium"
                    href="#"
                  >
                    privacy policy
                  </a>
                </li>
                <li>
                  <a
                    className="text-on-surface-variant hover:text-brand-teal transition-colors text-sm font-medium"
                    href="#"
                  >
                    contact us
                  </a>
                </li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h6 className="text-xs font-bold tracking-widest text-on-surface mb-8">
                social
              </h6>
              <ul className="space-y-4">
                <li>
                  <a
                    className="text-on-surface-variant hover:text-brand-teal transition-colors text-sm font-medium"
                    href="#"
                  >
                    linkedin
                  </a>
                </li>
                <li>
                  <a
                    className="text-on-surface-variant hover:text-brand-teal transition-colors text-sm font-medium"
                    href="#"
                  >
                    twitter
                  </a>
                </li>
                <li>
                  <a
                    className="text-on-surface-variant hover:text-brand-teal transition-colors text-sm font-medium"
                    href="#"
                  >
                    instagram
                  </a>
                </li>
              </ul>
            </div>
            <div className="md:col-span-4">
              <h6 className="text-xs font-bold tracking-widest text-on-surface mb-8">
                subscribe
              </h6>
              <div className="flex items-center border-b border-brand-teal/20 py-4 group">
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm font-bold tracking-widest w-full placeholder:text-on-surface-variant/40"
                  placeholder="your email"
                  type="email"
                />
                <span
                  className="material-symbols-outlined text-brand-teal cursor-pointer group-hover:translate-x-2 transition-transform"
                  data-icon="arrow_forward"
                >
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-outline-variant/10 text-[10px] font-bold tracking-widest text-on-surface-variant/50">
            <p>© 2024 cavite placement portal.</p>
            <div className="flex gap-8">
              <a href="#">terms of service</a>
              <a href="#">architecture</a>
              <a href="#">careers</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
