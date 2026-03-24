import {
  ArrowRight,
  BarChart2,
  Bell,
  CheckCircle2,
  ChevronRight,
  Instagram,
  Linkedin,
  Lock,
  Menu,
  RefreshCw,
  Shield,
  Snowflake,
  TrendingUp,
  Twitter,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Static chart data ────────────────────────────────────────────────────────
const phoneChartBars = [
  { month: "jan", h: 30, last: false },
  { month: "feb", h: 45, last: false },
  { month: "mar", h: 38, last: false },
  { month: "apr", h: 60, last: false },
  { month: "may", h: 52, last: false },
  { month: "jun", h: 75, last: false },
  { month: "jul", h: 68, last: false },
  { month: "aug", h: 90, last: false },
  { month: "sep", h: 82, last: false },
  { month: "oct", h: 100, last: true },
];

const dashChartBars = [
  { month: "jan", h: 20, highlight: false },
  { month: "feb", h: 35, highlight: false },
  { month: "mar", h: 28, highlight: false },
  { month: "apr", h: 45, highlight: false },
  { month: "may", h: 40, highlight: false },
  { month: "jun", h: 60, highlight: false },
  { month: "jul", h: 55, highlight: false },
  { month: "aug", h: 70, highlight: false },
  { month: "sep", h: 65, highlight: false },
  { month: "oct", h: 80, highlight: false },
  { month: "nov", h: 85, highlight: true },
  { month: "dec", h: 100, highlight: true },
];

// ─── Scroll-fade hook ─────────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return ref;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { id: "features", label: "Features" },
    { id: "how-it-works", label: "How It Works" },
    { id: "testimonials", label: "Testimonials" },
    { id: "waitlist", label: "Join Waitlist" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-darkest/95 backdrop-blur-md shadow-lg border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 group"
            data-ocid="nav.link"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "oklch(0.82 0.12 210 / 20%)",
                border: "1px solid oklch(0.82 0.12 210 / 40%)",
              }}
            >
              <Snowflake className="w-4 h-4 text-cyan" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Freeze<span className="text-cyan">funds</span>
            </span>
          </button>

          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {links.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => scrollTo(l.id)}
                data-ocid="nav.link"
                className="px-4 py-2 text-sm font-medium text-muted-cool hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              data-ocid="nav.secondary_button"
              className="px-4 py-2 text-sm font-medium rounded-xl border border-white/20 text-foreground hover:border-white/40 hover:bg-white/5 transition-all"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => scrollTo("waitlist")}
              data-ocid="nav.primary_button"
              className="px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.82 0.12 210), oklch(0.87 0.13 205))",
                color: "oklch(0.09 0.025 255)",
                boxShadow: "0 0 20px oklch(0.82 0.12 210 / 30%)",
              }}
            >
              Get Started
            </button>
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-navy-darkest/98 backdrop-blur-md border-t border-white/5 px-4 py-4 space-y-1">
          {links.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => {
                scrollTo(l.id);
                setMenuOpen(false);
              }}
              data-ocid="nav.link"
              className="block w-full text-left px-4 py-3 text-sm font-medium text-muted-cool hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
            >
              {l.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              className="w-full px-4 py-2.5 text-sm font-medium rounded-xl border border-white/20 text-foreground hover:bg-white/5 transition-all"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                scrollTo("waitlist");
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl transition-all"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.82 0.12 210), oklch(0.87 0.13 205))",
                color: "oklch(0.09 0.025 255)",
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.09 0.025 255) 0%, oklch(0.11 0.03 240) 50%, oklch(0.10 0.04 230) 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-40 animate-gradient"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.09 0.025 260), oklch(0.12 0.04 225), oklch(0.10 0.03 245))",
        }}
      />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-[0.04] pointer-events-none">
        <Snowflake
          className="animate-slow-spin text-foreground"
          style={{ width: "600px", height: "600px" }}
          strokeWidth={0.5}
        />
      </div>
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "oklch(0.82 0.12 210)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border"
              style={{
                background: "oklch(0.82 0.12 210 / 10%)",
                borderColor: "oklch(0.82 0.12 210 / 30%)",
                color: "oklch(0.87 0.13 205)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Now in beta — join the waitlist
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground">
              Lock In Your Savings.
              <br />
              <span className="text-cyan">Unlock</span> Your Future.
            </h1>

            <p className="text-base sm:text-lg text-muted-cool leading-relaxed max-w-lg">
              Freezefunds gives you lockable savings accounts that protect your
              money from impulse spending — with automated rules, real-time
              insights, and smart notifications to keep you on track.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <button
                type="button"
                onClick={() => scrollTo("waitlist")}
                data-ocid="hero.primary_button"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105 hover:shadow-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.82 0.12 210), oklch(0.87 0.13 205))",
                  color: "oklch(0.09 0.025 255)",
                  boxShadow: "0 0 30px oklch(0.82 0.12 210 / 35%)",
                }}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollTo("features")}
                data-ocid="hero.secondary_button"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl font-medium text-base text-muted-cool hover:text-foreground transition-colors"
              >
                See how it works
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              {["Bank-level security", "FDIC insured", "Zero fees"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 text-xs text-muted-cool"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  const phoneAccounts = [
    { name: "Emergency Fund", amount: "$5,000", locked: true, pct: 80 },
    { name: "Vacation 2026", amount: "$3,200", locked: false, pct: 54 },
    { name: "New Laptop", amount: "$4,280", locked: true, pct: 71 },
  ];

  return (
    <div className="relative">
      <div
        className="absolute inset-0 scale-75 blur-3xl opacity-20 rounded-full"
        style={{ background: "oklch(0.82 0.12 210)" }}
      />
      <div
        className="relative w-72 rounded-[2.5rem] p-3 border shadow-2xl"
        style={{
          background: "oklch(0.12 0.03 255)",
          borderColor: "oklch(0.82 0.12 210 / 25%)",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.6), 0 0 40px oklch(0.82 0.12 210 / 15%)",
          transform: "perspective(1200px) rotateY(-6deg) rotateX(3deg)",
        }}
      >
        <div className="bg-navy-mid rounded-[2rem] overflow-hidden p-5 space-y-5">
          <div className="flex items-center justify-between text-xs text-muted-cool">
            <span>9:41</span>
            <span className="font-semibold text-cyan text-xs">Freezefunds</span>
            <span>●●●</span>
          </div>

          <div
            className="rounded-2xl p-4 space-y-1"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.82 0.12 210 / 15%), oklch(0.82 0.12 210 / 5%))",
              border: "1px solid oklch(0.82 0.12 210 / 20%)",
            }}
          >
            <p className="text-xs text-muted-cool">Total Frozen Savings</p>
            <p className="text-3xl font-extrabold text-foreground">
              $12,480
              <span className="text-base font-medium text-cyan">.00</span>
            </p>
            <div
              className="flex items-center gap-1 text-xs"
              style={{ color: "oklch(0.82 0.12 210)" }}
            >
              <TrendingUp className="w-3 h-3" />
              +4.2% this month
            </div>
          </div>

          <div className="space-y-2">
            {phoneAccounts.map((acc) => (
              <div
                key={acc.name}
                className="rounded-xl p-3 flex items-center gap-3"
                style={{
                  background: "oklch(0.11 0.025 255)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: acc.locked
                      ? "oklch(0.82 0.12 210 / 15%)"
                      : "rgba(255,255,255,0.05)",
                  }}
                >
                  <Lock
                    className="w-3.5 h-3.5"
                    style={{
                      color: acc.locked
                        ? "oklch(0.82 0.12 210)"
                        : "oklch(0.58 0.02 250)",
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-foreground truncate">
                      {acc.name}
                    </span>
                    <span className="text-xs font-semibold text-cyan ml-2">
                      {acc.amount}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${acc.pct}%`,
                        background:
                          "linear-gradient(90deg, oklch(0.82 0.12 210), oklch(0.87 0.13 205))",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-3"
            style={{
              background: "oklch(0.11 0.025 255)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-xs text-muted-cool mb-2">Savings growth</p>
            <div className="flex items-end gap-1 h-12">
              {phoneChartBars.map((bar) => (
                <div
                  key={bar.month}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${bar.h}%`,
                    background: bar.last
                      ? "oklch(0.82 0.12 210)"
                      : "oklch(0.82 0.12 210 / 30%)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Lock,
    title: "Lockable Accounts",
    desc: "Create savings vaults with customizable unlock conditions — time-based, goal-based, or manual approval required.",
  },
  {
    icon: RefreshCw,
    title: "Automated Savings",
    desc: "Set recurring transfers, round-up rules, and percentage-based auto-deposits to grow your savings on autopilot.",
  },
  {
    icon: BarChart2,
    title: "Financial Insights",
    desc: "Visual dashboards and trend reports show you exactly where your money goes and how your savings are growing.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Get nudges before you overspend, milestone alerts when you hit goals, and unlock reminders when accounts mature.",
  },
];

function Features() {
  const ref = useFadeIn();

  return (
    <section
      id="features"
      className="py-24 lg:py-32"
      style={{ background: "oklch(0.10 0.025 255)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="fade-in text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border mb-5"
            style={{
              background: "oklch(0.82 0.12 210 / 10%)",
              borderColor: "oklch(0.82 0.12 210 / 30%)",
              color: "oklch(0.87 0.13 205)",
            }}
          >
            Why Freezefunds?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Everything you need to
            <br />
            <span className="text-cyan">save smarter</span>
          </h2>
          <p className="text-base text-muted-cool max-w-xl mx-auto leading-relaxed">
            Freezefunds combines smart automation with behavioral finance to
            help you build lasting wealth — one locked vault at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  delay,
}: { feature: (typeof features)[0]; delay: number }) {
  const ref = useFadeIn();
  const Icon = feature.icon;

  return (
    <div
      ref={ref}
      className="fade-in group rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 cursor-default"
      style={{
        background: "oklch(0.15 0.035 255)",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "oklch(0.82 0.12 210 / 30%)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 40px rgba(0,0,0,0.4), 0 0 20px oklch(0.82 0.12 210 / 10%)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(255,255,255,0.08)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 24px rgba(0,0,0,0.3)";
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
        style={{
          background: "oklch(0.82 0.12 210 / 15%)",
          border: "1px solid oklch(0.82 0.12 210 / 25%)",
          boxShadow: "0 0 16px oklch(0.82 0.12 210 / 15%)",
        }}
      >
        <Icon className="w-5 h-5 text-cyan" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">
        {feature.title}
      </h3>
      <p className="text-sm text-muted-cool leading-relaxed">{feature.desc}</p>
    </div>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
const steps = [
  {
    num: "01",
    title: "Create a savings vault",
    desc: "Choose a goal — emergency fund, vacation, big purchase — and set your target amount and lock conditions.",
  },
  {
    num: "02",
    title: "Automate your deposits",
    desc: "Link your bank and set up recurring transfers, round-ups, or paycheck splits. Savings happen automatically.",
  },
  {
    num: "03",
    title: "Watch your money grow",
    desc: "Track progress with real-time charts and insights. Get notified when you hit milestones or your vault unlocks.",
  },
];

function HowItWorks() {
  const ref = useFadeIn();

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-navy-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div ref={ref} className="fade-in space-y-8">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border mb-5"
                style={{
                  background: "oklch(0.82 0.12 210 / 10%)",
                  borderColor: "oklch(0.82 0.12 210 / 30%)",
                  color: "oklch(0.87 0.13 205)",
                }}
              >
                How It Works
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                Three simple steps to
                <br />
                <span className="text-cyan">financial freedom</span>
              </h2>
              <p className="mt-4 text-base text-muted-cool leading-relaxed">
                Freezefunds makes saving effortless. Set it up once, and let the
                platform do the heavy lifting while you focus on your goals.
              </p>
            </div>

            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{
                      background: "oklch(0.82 0.12 210 / 15%)",
                      border: "1px solid oklch(0.82 0.12 210 / 30%)",
                      color: "oklch(0.82 0.12 210)",
                    }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-cool leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

const dashVaults = [
  { name: "Emergency Fund", target: "$10,000", saved: "$7,500", pct: 75 },
  { name: "House Down Payment", target: "$40,000", saved: "$12,480", pct: 31 },
];

const dashStats = [
  { label: "Total Saved", value: "$12.4K" },
  { label: "Vaults", value: "4 active" },
  { label: "Monthly", value: "+$840" },
];

function DashboardMockup() {
  return (
    <div
      className="w-full max-w-md rounded-2xl p-5 border space-y-4"
      style={{
        background: "oklch(0.13 0.03 255)",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">My Vaults</p>
        <span className="text-xs text-cyan">View all →</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {dashStats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-3 text-center"
            style={{
              background: "oklch(0.11 0.025 255)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-xs text-muted-cool">{s.label}</p>
            <p className="text-sm font-bold text-foreground mt-0.5">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl p-4"
        style={{
          background: "oklch(0.11 0.025 255)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-foreground">
            Savings over time
          </p>
          <span className="text-xs text-muted-cool">12 months</span>
        </div>
        <div className="flex items-end gap-1.5 h-20">
          {dashChartBars.map((bar) => (
            <div
              key={bar.month}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${bar.h}%`,
                background: bar.highlight
                  ? "linear-gradient(180deg, oklch(0.87 0.13 205), oklch(0.82 0.12 210))"
                  : "oklch(0.82 0.12 210 / 25%)",
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-cool">Jan</span>
          <span className="text-xs text-muted-cool">Jun</span>
          <span className="text-xs text-muted-cool">Dec</span>
        </div>
      </div>

      {dashVaults.map((v) => (
        <div
          key={v.name}
          className="flex items-center gap-3 rounded-xl p-3"
          style={{
            background: "oklch(0.11 0.025 255)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "oklch(0.82 0.12 210 / 15%)",
              border: "1px solid oklch(0.82 0.12 210 / 25%)",
            }}
          >
            <Lock className="w-4 h-4 text-cyan" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-xs font-medium text-foreground">
                {v.name}
              </span>
              <span className="text-xs text-cyan">{v.pct}%</span>
            </div>
            <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${v.pct}%`,
                  background:
                    "linear-gradient(90deg, oklch(0.82 0.12 210), oklch(0.87 0.13 205))",
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-cool">{v.saved}</span>
              <span className="text-xs text-muted-cool">{v.target}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────
function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const ref = useFadeIn();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    console.log("Waitlist signup:", email);
    setSubmitted(true);
    setError("");
  }

  return (
    <section
      id="waitlist"
      className="py-24 lg:py-32"
      style={{ background: "oklch(0.10 0.025 255)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className="fade-in relative rounded-3xl p-10 lg:p-16 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.14 0.04 240), oklch(0.12 0.03 255))",
            border: "1px solid oklch(0.82 0.12 210 / 20%)",
            boxShadow: "0 0 80px oklch(0.82 0.12 210 / 8%)",
          }}
        >
          <div className="absolute -right-16 -top-16 opacity-[0.03] pointer-events-none">
            <Snowflake
              style={{ width: "400px", height: "400px" }}
              strokeWidth={0.5}
            />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border mb-6"
              style={{
                background: "oklch(0.82 0.12 210 / 10%)",
                borderColor: "oklch(0.82 0.12 210 / 30%)",
                color: "oklch(0.87 0.13 205)",
              }}
            >
              Limited early access
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Join the Freezefunds
              <br />
              <span className="text-cyan">Waitlist</span>
            </h2>
            <p className="text-base text-muted-cool leading-relaxed mb-10">
              Be among the first to experience the future of disciplined
              savings. Early members get lifetime fee-free access and priority
              features.
            </p>

            {submitted ? (
              <div
                data-ocid="waitlist.success_state"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold"
                style={{
                  background: "oklch(0.82 0.12 210 / 15%)",
                  border: "1px solid oklch(0.82 0.12 210 / 40%)",
                  color: "oklch(0.87 0.13 205)",
                }}
              >
                <CheckCircle2 className="w-5 h-5" />
                You&rsquo;re on the list! We&rsquo;ll be in touch soon.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                data-ocid="waitlist.modal"
                className="space-y-3"
              >
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your email address"
                    data-ocid="waitlist.input"
                    className="flex-1 px-5 py-3.5 rounded-xl text-sm text-foreground placeholder:text-muted-cool/60 outline-none transition-all"
                    style={{
                      background: "oklch(0.11 0.025 255)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "oklch(0.82 0.12 210 / 50%)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.12)";
                    }}
                  />
                  <button
                    type="submit"
                    data-ocid="waitlist.submit_button"
                    className="px-7 py-3.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.82 0.12 210), oklch(0.87 0.13 205))",
                      color: "oklch(0.09 0.025 255)",
                      boxShadow: "0 0 20px oklch(0.82 0.12 210 / 30%)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 0 32px oklch(0.82 0.12 210 / 50%)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 0 20px oklch(0.82 0.12 210 / 30%)";
                    }}
                  >
                    Join Waitlist
                  </button>
                </div>
                {error && (
                  <p
                    data-ocid="waitlist.error_state"
                    className="text-xs"
                    style={{ color: "oklch(0.704 0.191 22.216)" }}
                  >
                    {error}
                  </p>
                )}
                <p className="text-xs text-muted-cool">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    initials: "SM",
    name: "Sarah Mitchell",
    role: "Product Designer, NYC",
    quote:
      "I finally paid off my student loans because Freezefunds made it impossible to dip into my savings account. The lock feature is genuinely life-changing.",
  },
  {
    initials: "JR",
    name: "James Rodriguez",
    role: "Software Engineer, Austin",
    quote:
      "Automated savings rules meant I saved $10K for a house down payment without even thinking about it. The financial insights dashboard is incredible.",
  },
  {
    initials: "AC",
    name: "Amara Chen",
    role: "Marketing Manager, London",
    quote:
      "The smart notifications actually helped me understand my spending habits. I cut unnecessary expenses by 30% in just three months.",
  },
];

function Testimonials() {
  const headerRef = useFadeIn();

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-navy-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="fade-in text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Loved by <span className="text-cyan">early savers</span>
          </h2>
          <p className="text-base text-muted-cool max-w-lg mx-auto">
            Thousands of people are already transforming their financial lives
            with Freezefunds.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  delay,
}: { testimonial: (typeof testimonials)[0]; delay: number }) {
  const ref = useFadeIn();

  return (
    <div
      ref={ref}
      className="fade-in rounded-2xl p-6 border flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 cursor-default"
      style={{
        background: "oklch(0.15 0.035 255)",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "oklch(0.82 0.12 210 / 25%)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 40px rgba(0,0,0,0.4), 0 0 20px oklch(0.82 0.12 210 / 8%)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(255,255,255,0.08)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 24px rgba(0,0,0,0.3)";
      }}
    >
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s} className="text-cyan text-sm">
            ★
          </span>
        ))}
      </div>
      <p className="text-sm text-muted-cool leading-relaxed flex-1 italic">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.82 0.12 210 / 30%), oklch(0.82 0.12 210 / 10%))",
            border: "1px solid oklch(0.82 0.12 210 / 30%)",
            color: "oklch(0.87 0.13 205)",
          }}
        >
          {testimonial.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {testimonial.name}
          </p>
          <p className="text-xs text-muted-cool">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection() {
  const ref = useFadeIn();

  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: "oklch(0.10 0.025 255)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className="fade-in relative rounded-3xl p-12 lg:p-20 text-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.82 0.12 210 / 15%) 0%, oklch(0.12 0.04 240) 50%, oklch(0.82 0.12 210 / 10%) 100%)",
            border: "1px solid oklch(0.82 0.12 210 / 20%)",
          }}
        >
          <div
            className="absolute top-0 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ background: "oklch(0.82 0.12 210)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ background: "oklch(0.82 0.12 210)" }}
          />

          <div className="relative z-10">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 mx-auto"
              style={{
                background: "oklch(0.82 0.12 210 / 15%)",
                border: "1px solid oklch(0.82 0.12 210 / 30%)",
                boxShadow: "0 0 30px oklch(0.82 0.12 210 / 25%)",
              }}
            >
              <Shield className="w-7 h-7 text-cyan" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-5">
              Start Saving Smarter
              <br />
              <span className="text-cyan">Today</span>
            </h2>
            <p className="text-base text-muted-cool max-w-lg mx-auto mb-10 leading-relaxed">
              Join thousands of people who have taken control of their finances.
              Lock in your savings, unlock your potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => scrollTo("waitlist")}
                data-ocid="cta.primary_button"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.82 0.12 210), oklch(0.87 0.13 205))",
                  color: "oklch(0.09 0.025 255)",
                  boxShadow: "0 0 30px oklch(0.82 0.12 210 / 35%)",
                }}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollTo("features")}
                data-ocid="cta.secondary_button"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium text-base border border-white/15 text-foreground hover:border-white/30 hover:bg-white/5 transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
const footerColumns = [
  {
    title: "Product",
    links: ["Features", "How It Works", "Security", "Pricing"],
  },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  },
];

const socialLinks = [
  { Icon: Twitter, label: "Twitter" },
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: Instagram, label: "Instagram" },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t"
      style={{
        background: "oklch(0.09 0.025 255)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-5">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2"
              data-ocid="footer.link"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "oklch(0.82 0.12 210 / 15%)",
                  border: "1px solid oklch(0.82 0.12 210 / 30%)",
                }}
              >
                <Snowflake className="w-4 h-4 text-cyan" />
              </div>
              <span className="font-bold text-lg text-foreground">
                Freeze<span className="text-cyan">funds</span>
              </span>
            </button>
            <p className="text-sm text-muted-cool leading-relaxed max-w-xs">
              Lock in your savings. Unlock your future. The smarter way to save
              money with discipline and automation.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="https://freezefunds.com"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="footer.link"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "oklch(0.15 0.035 255)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "oklch(0.73 0.025 250)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "oklch(0.82 0.12 210 / 40%)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "oklch(0.82 0.12 210)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "oklch(0.73 0.025 250)";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4
                className="text-xs font-semibold uppercase text-foreground mb-5"
                style={{ letterSpacing: "0.1em" }}
              >
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      data-ocid="footer.link"
                      className="text-sm text-muted-cool hover:text-foreground transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-cool"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span>&copy; {year} Freezefunds. All rights reserved.</span>
          <span>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan hover:underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-navy-dark">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Waitlist />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
