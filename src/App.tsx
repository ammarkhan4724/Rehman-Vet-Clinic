import { useState, useEffect } from "react";
import Logo from "./components/Logo";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton";

const NAV = [
  { label: "Home", href: "/#home" },
  { label: "Emergency 24/7", href: "/services/emergency-veterinary-care.html" },
  { label: "Vaccinations", href: "/services/pet-vaccination-center.html" },
  { label: "Home Visits", href: "/services/home-visit-veterinary.html" },
  { label: "DHA Lahore", href: "/locations/dha-lahore-veterinary-clinic.html" },
  { label: "Reviews", href: "/#reviews" },
  { label: "About", href: "/#about" },
];

// Deterministic pseudo-random based on a seed (stable per date+type+time)
// Uses a simple hash so slots don't shuffle on every React render
function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(Math.sin(h)) ; // 0..1 deterministic
}

// Get today in LOCAL timezone (not UTC) to avoid date-shift bugs
function getLocalDate(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function generateSlots(date: string, type: "home" | "video") {
  // Append T12:00:00 so Date parses as LOCAL noon (not UTC midnight)
  // This prevents day-of-week bugs across timezones
  const d = new Date(date + "T12:00:00");
  const day = d.getDay();
  const isWeekend = day === 0 || day === 6;

  if (type === "video") {
    // 24/7 video — every 2 hours, almost always available
    const times = [
      { time: "00:00", label: "12:00 AM" },
      { time: "02:00", label: "2:00 AM" },
      { time: "04:00", label: "4:00 AM" },
      { time: "06:00", label: "6:00 AM" },
      { time: "08:00", label: "8:00 AM" },
      { time: "10:00", label: "10:00 AM" },
      { time: "12:00", label: "12:00 PM" },
      { time: "14:00", label: "2:00 PM" },
      { time: "16:00", label: "4:00 PM" },
      { time: "18:00", label: "6:00 PM" },
      { time: "20:00", label: "8:00 PM" },
      { time: "22:00", label: "10:00 PM" },
    ];
    return times.map(s => ({
      ...s,
      // ~80% availability, deterministic per date+time
      available: seededRandom(`video-${date}-${s.time}`) > 0.2,
    }));
  }

  // Home visits: 8am–7pm, fewer on weekends
  const baseSlots = [
    { time: "08:00", label: "8:00 AM" },
    { time: "09:30", label: "9:30 AM" },
    { time: "11:00", label: "11:00 AM" },
    { time: "12:30", label: "12:30 PM" },
    { time: "14:00", label: "2:00 PM" },
    { time: "15:30", label: "3:30 PM" },
    { time: "17:00", label: "5:00 PM" },
    { time: "18:30", label: "6:30 PM" },
  ];

  return baseSlots.map(s => ({
    ...s,
    // Weekdays ~65% free, weekends ~40% free (deterministic)
    available: isWeekend
      ? seededRandom(`home-${date}-${s.time}`) > 0.6
      : seededRandom(`home-${date}-${s.time}`) > 0.35,
  }));
}

export default function App() {
  useEffect(() => {
    // Smooth scroll
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f7] text-slate-800 antialiased overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Outfit', system-ui, -apple-system, sans-serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(14,165,233,0.3); }
          50% { box-shadow: 0 0 40px rgba(14,165,233,0.5); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-slide-in { animation: slide-in 0.6s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.5s ease-out forwards; }
      `}</style>
      <Header />
      <Hero />
      <HowItWorks />
      <Services />
      <Booking />
      <Reviews />
      <About />
      <CTA />
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}>
      <div className={`mx-4 md:mx-auto max-w-7xl transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-900/5" : "bg-white/70 backdrop-blur-md"} rounded-full border border-white/50`}>
        <div className="px-5 md:px-7 py-3 flex items-center justify-between">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1 bg-emerald-50/80 border border-emerald-100/60 rounded-full p-1">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="px-4 py-2 text-[14px] font-medium text-slate-700 hover:text-emerald-800 hover:bg-white rounded-full transition-all shadow-sm shadow-transparent hover:shadow-emerald-900/5">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Direct Dial Helpline */}
            <a
              href="tel:+923114899904"
              className="hidden md:flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md"
            >
              <svg className="w-3.5 h-3.5 text-amber-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.21 2.2z" />
              </svg>
              <span>+92 311 4899904</span>
            </a>

            {/* Quick WhatsApp Pill */}
            <a
              href="https://wa.me/923114899904?text=Hello%20Dr.%20Rehman,%20I%20need%20a%20consultation%20for%20my%20pet."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-all shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            {/* Main CTA */}
            <a
              href="#book"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 hover:-translate-y-0.5 transition-all"
            >
              Book Now
            </a>

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              <div className="space-y-1.5">
                <div className={`w-5 h-0.5 bg-slate-700 transition ${open ? "rotate-45 translate-y-2" : ""}`} />
                <div className={`w-5 h-0.5 bg-slate-700 transition ${open ? "opacity-0" : ""}`} />
                <div className={`w-5 h-0.5 bg-slate-700 transition ${open ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden mx-4 mt-2 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-slide-in">
          <div className="p-3">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block px-5 py-3 rounded-2xl hover:bg-slate-50 font-medium text-slate-800">
                {n.label}
              </a>
            ))}

            <div className="mt-3 pt-3 border-t border-slate-100 px-3 flex flex-col gap-2">
              <a href="tel:+923114899904" className="flex items-center gap-2 text-sm font-bold text-slate-800 py-1.5">
                <span>📞 Call: +92 311 4899904</span>
              </a>
              <a href="mailto:info@rehmanvetclinic.com" className="flex items-center gap-2 text-xs font-semibold text-slate-600 py-1">
                <span>✉️ info@rehmanvetclinic.com</span>
              </a>
              <a
                href="https://wa.me/923114899904?text=Hello%20Dr.%20Rehman,%20I%20need%20a%20consultation%20for%20my%20pet."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold shadow-md shadow-[#25D366]/20 mt-1"
              >
                <span>Chat on WhatsApp (24/7)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function PawIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="currentColor">
      <path d="M226.5 92.9c14.3 7.3 22.8 23 20.9 38.6l-5.1 41.5c-3.1 25.1 14.8 47.7 39.9 50.8l41.5 5.1c15.6 1.9 31.3-6.6 38.6-20.9l22.6-44c15.2-29.6 54.3-33 74-6.4l28 37.4c17.5 23.4 12.8 56.6-10.6 74.1l-44.5 33.4c-21.7 16.3-51.4 18-74.8 4.3l-48.4-28.5c-5.8-3.4-12.8-2.6-17.8 2l-37.3 34.3c-20 18.4-50.6 19.3-71.5 2.1l-42-34.6c-17.4-14.3-21.1-39.4-8.5-57.5l29.4-42.3c14.3-20.5 41-26.6 62.6-14.3l48.4 27.6c5.8 3.3 12.8 2.6 17.8-2L219 146.4c12-10.4 30.2-9 40.5 3.3l12-13.8-45-53c-14.7-17.3-39.5-21-58.4-8.6l-37.4 24.5c-23.4 15.3-30.8 46.5-16.7 70.3l33.4 56.7c11.9 20.2 38 25.5 56.4 11.5l45.4-34.4c6.3-4.8 8.6-13.3 5.5-20.8l-18.4-44.3c-11.2-27.1 7.2-56.7 36.5-59z"/>
      <path d="M304.5 303.4c-9.3-19.1-30.8-27-49.9-17.6l-37 18.2c-23.7 11.6-40.2 32.5-45 58l-5.6 29.5c-4.4 23.1 10.8 45.4 33.9 49.8l29.5 5.6c25.5 4.8 51.5-6.7 66.8-29.6l23.5-35.3c13.7-20.6 6.9-48.5-13.7-61.2l-2.5-1.5z"/>
    </svg>
  );
}

function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/70 via-[#faf9f7] to-[#faf9f7]" />
        
        {/* Decorative Paws (Subtle Animations) */}
        <PawIcon className="absolute top-[15%] left-[8%] w-16 h-16 text-emerald-900/5 -rotate-12 animate-pulse" />
        <PawIcon className="absolute top-[35%] left-[12%] w-12 h-12 text-emerald-900/5 rotate-12 animate-pulse" style={{ animationDelay: "1s" }} />
        <PawIcon className="absolute top-[20%] right-[10%] w-24 h-24 text-amber-900/5 rotate-45 animate-float" />
        <PawIcon className="absolute bottom-[10%] left-[20%] w-20 h-20 text-emerald-900/5 -rotate-12 animate-float" style={{ animationDelay: "2s" }} />

        <div className="absolute top-20 right-[10%] w-72 h-72 bg-amber-200/35 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-0 left-[5%] w-96 h-96 bg-emerald-200/40 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="animate-slide-in">
            <div className="inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 bg-white rounded-full shadow-md shadow-slate-900/5 border border-emerald-100 mb-6 group hover:shadow-lg transition-all">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 text-slate-950 rounded-full text-[11px] font-extrabold tracking-wide">
                <span className="w-1.5 h-1.5 bg-slate-950 rounded-full animate-pulse" />
                LIVE
              </span>
              <span className="text-[13px] font-medium text-slate-700">Mobile vet in Lahore • 3 slots today</span>
            </div>

            <h1 className="text-[clamp(40px,6vw,72px)] font-[800] leading-[0.9] tracking-[-0.02em] text-slate-900">
              The vet
              <span className="relative inline-block mx-3">
                <span className="relative z-10 bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">comes to you</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-300" viewBox="0 0 200 12" fill="none">
                  <path d="M1 5.5C50 1.5 150 11 199 5.5" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.4"/>
                </svg>
              </span>
              <br/>day or night.
            </h1>

            <p className="mt-6 text-[18px] md:text-[20px] leading-relaxed text-slate-600 max-w-xl">
              I'm Dr. Saif — a mobile veterinarian. I do house calls across Lahore and 24/7 video consults for urgent pet worries. No stressful car rides. No waiting rooms.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <a href="#book" className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-2xl font-extrabold shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/35 hover:-translate-y-1 transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center justify-center gap-2">
                  Book home visit
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
              <a href="#book" className="px-8 py-4 bg-emerald-50/80 border-2 border-emerald-200 text-emerald-900 rounded-2xl font-semibold hover:border-emerald-400 hover:bg-emerald-100/60 hover:-translate-y-1 transition-all flex items-center justify-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                Start video now
              </a>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div>
                <div className="flex -space-x-3">
                  {[
                    "https://images.pexels.com/photos/34027685/pexels-photo-34027685.jpeg?auto=compress&w=80&h=80&fit=crop",
                    "https://images.pexels.com/photos/18414753/pexels-photo-18414753.jpeg?auto=compress&w=80&h=80&fit=crop",
                    "https://images.pexels.com/photos/29358402/pexels-photo-29358402.jpeg?auto=compress&w=80&h=80&fit=crop",
                    "https://images.pexels.com/photos/14440674/pexels-photo-14440674.jpeg?auto=compress&w=80&h=80&fit=crop",
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-10 h-10 rounded-full border-[3px] border-white object-cover shadow-md" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-[3px] border-white bg-slate-900 text-white grid place-items-center text-[11px] font-bold shadow-md">1.2k+</div>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_,i) => (
                    <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                  ))}
                </div>
                <div className="text-[13px] text-slate-600 mt-0.5"><b className="text-slate-900">4.9/5</b> — 847 home visits</div>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] animate-scale-in" style={{ animationDelay: "0.2s" }}>
            {/* Phone mockup */}
            <div className="relative z-20 mx-auto w-[300px] animate-float">
              <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl shadow-slate-900/30">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  <div className="h-[600px] relative">
                    <img src="https://images.pexels.com/photos/6235650/pexels-photo-6235650.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=800" alt="Vet" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-full" />
                    <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur text-xs font-bold mb-3">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        ON A VISIT
                      </div>
                      <div className="text-2xl font-bold">Dr. Saif</div>
                      <div className="text-sm opacity-90">En route • 8 min away</div>
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 py-2.5 bg-white/20 backdrop-blur-md rounded-xl text-sm font-medium border border-white/30">Message</button>
                        <button className="flex-1 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-semibold">Call</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-500 rounded-3xl rotate-12 blur-2xl opacity-40" />
            </div>

            {/* Floating cards */}
            <div className="absolute top-10 -left-4 md:left-0 z-30 animate-float" style={{ animationDelay: "1s" }}>
              <div className="bg-white rounded-2xl shadow-xl p-4 border border-emerald-100 w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 grid place-items-center text-2xl">💻</div>
                  <div>
                    <div className="text-xs text-slate-500">Video consult</div>
                    <div className="font-bold text-emerald-900">Available now</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-20 -right-4 md:right-10 z-30 animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="bg-white rounded-2xl shadow-xl p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <img src="https://images.pexels.com/photos/7469228/pexels-photo-7469228.jpeg?auto=compress&w=100&h=100&fit=crop" className="w-12 h-12 rounded-xl object-cover" alt="" />
                  <div>
                    <div className="text-xs text-slate-500">Next home visit</div>
                    <div className="font-bold text-slate-900">Today, 4:30 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: "📱", title: "Book in 30 seconds", desc: "Pick home visit or video. See live availability.", color: "from-amber-500 to-amber-600" },
    { icon: "🚗", title: "I come to you", desc: "For home visits, I arrive with full kit. No carrier stress.", color: "from-emerald-500 to-teal-600" },
    { icon: "💚", title: "Care & follow-up", desc: "Prescriptions sent, notes shared, 24/7 chat support.", color: "from-amber-400 to-emerald-600" },
  ];

  return (
    <section id="how" className="py-20 md:py-28 relative bg-gradient-to-b from-transparent via-emerald-50/40 to-transparent">
      <div className="max-w-7xl mx-auto px-5">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-4">How it works</div>
          <h2 className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-tight leading-[1.1] text-slate-900">
            Vet care without the waiting room
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((s, i) => (
            <div key={s.title} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
              <div className="relative bg-white rounded-[2rem] p-8 border border-slate-200 hover:border-slate-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} grid place-items-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    {s.icon}
                  </div>
                  <div className="text-5xl font-black text-slate-100 group-hover:text-slate-200 transition-colors">0{i+1}</div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    { icon: "🏠", title: "Home Visit Exam", price: "From $129", desc: "Full physical exam at your home. Vaccines, blood draw, nail trim.", tag: "Most booked" },
    { icon: "📹", title: "24/7 Video Consult", price: "$49", desc: "Instant video for vomiting, limping, skin, behavior. 15 min.", tag: "Instant" },
    { icon: "💉", title: "Vaccines at Home", price: "$89", desc: "Core vaccines, no clinic stress. Certificate emailed.", tag: null },
    { icon: "🩸", title: "Lab Work Mobile", price: "$149", desc: "Blood, urine, cytology collected at home. Results in 24h.", tag: null },
    { icon: "🐾", title: "Senior Pet Care", price: "$159", desc: "Arthritis, kidney, thyroid management at home.", tag: null },
    { icon: "🚨", title: "Urgent Home Visit", price: "$199", desc: "Same-day priority for emergencies. Call first.", tag: "24/7" },
  ];

  return (
    <section id="services" className="py-20 md:py-28 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-5">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-4">Services</div>
            <h2 className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-tight leading-[1.1]">Mobile & video care</h2>
          </div>
          <p className="md:text-right text-slate-300 max-w-md">Everything your pet needs, delivered to your door or screen.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div key={s.title} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[1.75rem] p-6 hover:bg-slate-900 hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300">
                {s.tag && (
                  <div className="absolute -top-3 -right-3 px-3.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[11px] font-extrabold rounded-full shadow-lg shadow-amber-500/30">
                    {s.tag}
                  </div>
                )}
                <div className="text-4xl mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform">{s.icon}</div>
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-xl font-bold">{s.title}</h3>
                  <div className="text-amber-400 font-extrabold">{s.price}</div>
                </div>
                <p className="text-slate-300 text-[15px] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Booking() {
  const [type, setType] = useState<"home" | "video">("home");
  const [date, setDate] = useState(getLocalDate());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", pet: "", address: "", concern: "" });
  const [booked, setBooked] = useState(false);

  const slots = generateSlots(date, type);
  const availableCount = slots.filter(s => s.available).length;

  const handleBook = () => {
    if (!selectedSlot || !form.name || !form.phone) return;
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      setStep(1);
      setSelectedSlot(null);
      setForm({ name: "", phone: "", pet: "", address: "", concern: "" });
    }, 4000);
  };

  return (
    <section id="book" className="py-20 md:py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f7] via-emerald-50/50 to-[#faf9f7]" />
      
      <div className="relative max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2">
            <div className="sticky top-28">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-4">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                Live booking
              </div>
              <h2 className="text-[clamp(32px,4vw,52px)] font-extrabold tracking-tight leading-[1.05] text-slate-900">
                See my real availability. Book instantly.
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Home visits across Lahore (DHA, Gulberg, Bahria, Model Town & all areas). Video calls 24/7.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  { icon: "✓", text: "No clinic fees" },
                  { icon: "✓", text: "Prescriptions sent to your pharmacy" },
                  { icon: "✓", text: "Follow-up chat included" },
                  { icon: "✓", text: "Cancel free up to 2 hours before" },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white grid place-items-center text-xs font-bold">{item.icon}</div>
                    <span className="text-slate-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <img src="https://images.pexels.com/photos/32788234/pexels-photo-32788234.jpeg?auto=compress&w=100&h=100&fit=crop" alt="Dr Rehman" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <div className="font-bold text-slate-900">Dr. Saif Ur Rehman, DVM</div>
                    <div className="text-sm text-slate-600">Mobile Vet • Lahore Practice • 9+ Yrs Exp</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                <div className="text-xs font-bold text-emerald-900 mb-1">Prefer instant WhatsApp booking?</div>
                <p className="text-xs text-slate-600 mb-2.5">Send a quick WhatsApp text with your pet's name &amp; location in Lahore.</p>
                <a
                  href="https://wa.me/923114899904?text=Hello%20Dr.%20Rehman,%20I%20would%20like%20to%20book%20a%20home%20visit%20in%20Lahore."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Book via WhatsApp: +92 311 4899904</span>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-emerald-950/5 border border-emerald-100/80 overflow-hidden">
              {/* Type selector */}
              <div className="p-2 bg-emerald-50/40 border-b border-emerald-100">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "home", label: "Home Visit", icon: "🏠", desc: "I come to you" },
                    { id: "video", label: "Video Call", icon: "📹", desc: "24/7 instant" },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => { setType(opt.id as any); setSelectedSlot(null); setStep(1); }}
                      className={`relative p-4 rounded-2xl text-left transition-all ${type === opt.id ? "bg-white shadow-md border border-emerald-200/60" : "hover:bg-white/50"}`}
                    >
                      {type === opt.id && <div className="absolute inset-0 rounded-2xl ring-2 ring-amber-500" />}
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{opt.icon}</div>
                        <div>
                          <div className="font-bold text-slate-900">{opt.label}</div>
                          <div className="text-xs text-slate-500">{opt.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-8">
                {step === 1 && (
                  <div className="animate-slide-in">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Choose date & time</h3>
                      <div className="text-sm">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 font-bold">
                          <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                          {availableCount} slots free
                        </span>
                      </div>
                    </div>

                    <input
                      type="date"
                      value={date}
                      onChange={(e) => { setDate(e.target.value); setSelectedSlot(null); }}
                      min={getLocalDate()}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200/80 bg-emerald-50/30 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none font-medium mb-4"
                    />

                    {type === "home" && [0, 6].includes(new Date(date + "T12:00:00").getDay()) && (
                      <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
                        <span>💡</span>
                        <span>Fewer home-visit slots on weekends. Try <button onClick={() => setType("video")} className="font-bold underline text-amber-700">video call</button> for more availability.</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {slots.map((slot) => (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot.time)}
                          className={`relative p-3.5 rounded-xl border-2 text-sm font-bold transition-all ${
                            !slot.available
                              ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed line-through font-normal"
                              : selectedSlot === slot.time
                              ? "bg-gradient-to-r from-amber-500 to-amber-600 border-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105"
                              : "bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/60 text-slate-800 hover:-translate-y-0.5"
                          }`}
                        >
                          {slot.label}
                          {!slot.available && <span className="absolute -top-1.5 -right-1.5 text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded-full font-normal">Booked</span>}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={!selectedSlot}
                      onClick={() => setStep(2)}
                      className="mt-8 w-full py-4 rounded-xl bg-slate-900 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-900 hover:-translate-y-0.5 transition-all shadow-lg"
                    >
                      Continue — {selectedSlot ? slots.find(s => s.time === selectedSlot)?.label : "Select time"}
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-slide-in">
                    <button onClick={() => setStep(1)} className="mb-4 text-sm font-medium text-emerald-800 hover:text-emerald-950 flex items-center gap-1">
                      ← Back to times
                    </button>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Your details</h3>
                    <p className="text-sm text-slate-600 mb-6">
                      {type === "home" ? "Home visit" : "Video call"} • {new Date(date + "T12:00:00").toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {slots.find(s => s.time === selectedSlot)?.label}
                    </p>

                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <input placeholder="Your name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="px-4 py-3 rounded-xl border border-emerald-200/80 bg-emerald-50/30 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" />
                        <input placeholder="Phone *" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="px-4 py-3 rounded-xl border border-emerald-200/80 bg-emerald-50/30 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" />
                      </div>
                      <input placeholder="Pet's name & type (e.g., Milo, cat)" value={form.pet} onChange={e => setForm({...form, pet: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-emerald-200/80 bg-emerald-50/30 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" />
                      {type === "home" && (
                        <input placeholder="Home address *" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-emerald-200/80 bg-emerald-50/30 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" />
                      )}
                      <textarea placeholder="What's going on? (optional)" value={form.concern} onChange={e => setForm({...form, concern: e.target.value})} rows={3} className="w-full px-4 py-3 rounded-xl border border-emerald-200/80 bg-emerald-50/30 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none resize-none" />
                    </div>

                    <button
                      onClick={handleBook}
                      disabled={!form.name || !form.phone || (type === "home" && !form.address) || booked}
                      className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold disabled:opacity-40 transition-all shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 hover:-translate-y-0.5"
                    >
                      {booked ? "✓ Booked! Confirmation sent" : `Confirm ${type === "home" ? "Home Visit" : "Video Call"} — ${type === "home" ? "$129" : "$49"}`}
                    </button>
                    <p className="mt-3 text-xs text-center text-slate-500">You'll get SMS confirmation instantly. Pay after visit.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Trust */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">🔒 HIPAA secure</span>
              <span className="flex items-center gap-1.5">💳 Pay after care</span>
              <span className="flex items-center gap-1.5">↩️ Free cancellation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    { name: "Azhar Naeem", pet: "Local Guide", text: "Thank you very much for the successful treatment of my cat, Tiny. I'm happy to share that Tiny is now well again. I truly appreciate your support and care.", time: "4 months ago", rating: 5 },
    { name: "Fakhar Zaman", pet: "1 review", text: "Best vet in Lahore Dr.Saif ur Rehman. My cat suffered from fungal Infection. By the Grace of Allah Almighty My cat is in recovery phase.", time: "6 months ago", rating: 5 },
    { name: "Muhammad Haris Aijaz", pet: "2 reviews", text: "Our experience with Dr. Saif has been excellent. He is great with all animals, knowledgeable, and caring. He treats every pet with skill and kindness, putting both animals and owners at ease. We highly recommend him.", time: "7 months ago", rating: 5 },
    { name: "Hunter Wayne", pet: "1 review", text: "Very professional, knowledegable and compassionate Dr Saif he very calmly and compassionatly treated my 16yrs old family dog who was very sick satisfied with his services .", time: "5 months ago", rating: 5 },
    { name: "Ali Raza", pet: "1 review", text: "Best veterinarian Dr Saif ur Rehman. He not only diagnose disease. My cat suffered from Kidney disease and past 2 vets didn't diagnose the disease. He is the passionate veterinarian. 100% recommended.", time: "4 months ago", rating: 5 },
  ];

  return (
    <section id="reviews" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-tight text-slate-900">What Our Clients Say</h2>
          <p className="mt-3 text-lg text-slate-600">Real stories from our Google Reviews.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="group relative" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/25 to-emerald-500/0 rounded-[1.75rem] opacity-0 group-hover:opacity-100 blur-xl transition-all" />
              <div className="relative bg-[#faf9f7] border border-emerald-100 rounded-[1.75rem] p-7 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-200 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(r.rating)].map((_,i) => <span key={i} className="text-amber-500">★</span>)}
                </div>
                <p className="text-slate-700 leading-relaxed">"{r.text}"</p>
                <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{r.name}</div>
                    <div className="text-sm text-slate-500">{r.pet}</div>
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold">{r.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white border border-emerald-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-emerald-300 transition-all flex items-center gap-2 shadow-sm">
            <span>Read more Google Reviews</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/25">
            <span>⭐ Leave a Review</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-gradient-to-b from-transparent via-emerald-50/30 to-transparent">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-amber-200/50 to-emerald-200/50 rounded-[3rem] blur-2xl" />
            <img src="https://images.pexels.com/photos/7468978/pexels-photo-7468978.jpeg?auto=compress&w=800&h=900&fit=crop" alt="Dr Rehman" className="relative w-full h-[520px] object-cover rounded-[2.5rem] shadow-2xl" />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-emerald-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 grid place-items-center font-black">DVM</div>
                <div>
                  <div className="font-bold text-slate-900">Dr. Saif Ur Rehman</div>
                  <div className="text-sm text-slate-600">DVM, Licensed Veterinarian • Lahore Practice</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-4">About</div>
            <h2 className="text-[clamp(32px,4vw,44px)] font-extrabold tracking-tight leading-[1.1] text-slate-900">
              I started mobile vet care because my own dog hated the clinic.
            </h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed">
              I'm Dr. Saif. After years in busy animal hospitals, I saw how much stress car rides and clinic waiting rooms caused pets in Lahore. Especially for cats and senior dogs. So I built a mobile practice that comes directly to you.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              My mobile van is a complete clinic on wheels — exam table, diagnostic microscope, vaccines, and emergency treatment kit. For video calls, I'm available 24/7 because pet emergencies don't check the clock.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { k: "9+ years", v: "Clinical Experience" },
                { k: "2,400+", v: "Home visits" },
                { k: "All Lahore", v: "Service coverage" },
                { k: "24/7", v: "Emergency support" },
              ].map(s => (
                <div key={s.v} className="p-4 rounded-2xl bg-white border border-emerald-100/80 shadow-sm">
                  <div className="text-2xl font-black text-slate-900">{s.k}</div>
                  <div className="text-sm text-emerald-700 font-semibold">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-5">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-[1px]">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500 opacity-60" />
          <div className="relative bg-slate-950 rounded-[2.5rem] px-8 py-14 md:px-14 md:py-16 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-5">Available now</div>
            <h3 className="text-[clamp(28px,4vw,44px)] font-extrabold text-white leading-tight">Worried about your pet right now?</h3>
            <p className="mt-3 text-slate-300 text-lg max-w-2xl mx-auto">Start a video call in 2 minutes, or book a home visit for today. I'm on call across Lahore.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#book" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-2xl font-black shadow-lg shadow-amber-500/25 hover:-translate-y-0.5 transition-all">Book Online</a>
              <a href="tel:+923114899904" className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-2xl font-bold hover:bg-white/15 transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-amber-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.21 2.2z" />
                </svg>
                <span>Call: +92 311 4899904</span>
              </a>
              <a href="https://wa.me/923114899904?text=Hello%20Dr.%20Rehman,%20I%20need%20a%20consultation%20for%20my%20pet." target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 hover:-translate-y-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <span>WhatsApp (24/7)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 border-t border-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-5 py-14">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition"></div>
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 grid place-items-center text-white shadow-lg group-hover:scale-105 transition-all">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.5 8.5H21L15.75 12.5L18 19L12 15L6 19L8.25 12.5L3 8.5H9.5L12 2Z" fill="white"></path></svg>
                </div>
              </div>
              <div>
                <div className="font-bold text-[17px] leading-none tracking-tight text-white">Rehman</div>
                <div className="text-[10px] font-extrabold text-emerald-400 tracking-widest uppercase">VETERINARY</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
              Dr. Saif brings hospital-grade mobile veterinary care directly to your doorstep in Lahore. 24/7 urgent video care, home vaccinations, laboratory diagnostics, and compassionate pet treatment.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://wa.me/923114899904?text=Hello%20Dr.%20Rehman,%20I%20need%20a%20consultation%20for%20my%20pet."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors border border-slate-800 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                WhatsApp: +92 311 4899904
              </a>
            </div>
          </div>

          {/* Col 2: Clinical Services & Silos */}
          <div>
            <div className="font-bold text-white text-sm mb-4 uppercase tracking-wider text-emerald-400">Clinical Services</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="/services/emergency-veterinary-care.html" className="hover:text-emerald-400 transition-colors">24/7 Emergency Care</a></li>
              <li><a href="/services/24-hour-vet-clinic-lahore.html" className="hover:text-emerald-400 transition-colors">24 Hour Animal Hospital</a></li>
              <li><a href="/services/pet-vaccination-center.html" className="hover:text-emerald-400 transition-colors">Pet Vaccination Center</a></li>
              <li><a href="/services/home-visit-veterinary.html" className="hover:text-emerald-400 transition-colors">Mobile Vet House Calls</a></li>
              <li><a href="/locations/dha-lahore-veterinary-clinic.html" className="hover:text-emerald-400 transition-colors">Vet in DHA Lahore</a></li>
              <li><a href="/blog/parvovirus-treatment-cost-survival-pakistan.html" className="hover:text-emerald-400 transition-colors">Parvovirus Protocol</a></li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div>
            <div className="font-bold text-white text-sm mb-4 uppercase tracking-wider text-emerald-400">Direct Contact</div>
            <div className="space-y-3.5 text-sm text-slate-400">
              <div>
                <span className="block text-xs font-semibold text-slate-500">Emergency &amp; Helpline:</span>
                <a href="tel:+923114899904" className="font-bold text-white hover:text-emerald-400 transition-colors">
                  +92 311 4899904
                </a>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-500">Official Email:</span>
                <a href="mailto:info@rehmanvetclinic.com" className="font-semibold text-white hover:text-emerald-400 transition-colors">
                  info@rehmanvetclinic.com
                </a>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-500">Service Coverage:</span>
                <span className="text-slate-400 font-medium">Lahore (DHA, Gulberg, Bahria, Model Town &amp; All Sectors)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Rehman Veterinary Clinic. All rights reserved. Dr. Saif Ur Rehman, DVM.</div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-500 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Serving All Lahore Neighborhoods 24/7
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}