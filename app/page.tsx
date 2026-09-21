import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

const FEATURES = [
  {
    title: "Track Your Journey",
    description:
      "Build a running record of every season, every team, every appearance — your grassroots career in one place.",
    icon: (
      <path
        d="M12 3l7 4v5c0 5-3.4 8.4-7 9-3.6-.6-7-4-7-9V7l7-4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Log Your Stats",
    description:
      "Goals, assists, clean sheets, ratings — add a match in seconds and watch your season totals build automatically.",
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Know Your Record",
    description:
      "Log the scoreline of every match and see your wins, draws and losses build up across League, Cup and Friendly games.",
    icon: (
      <>
        <path d="M4 4v16M20 4v16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M4 6h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-cream-200">
      <header className="relative overflow-hidden bg-pitch-950">
        <div className="absolute inset-0 bg-pitch-lines opacity-40" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-t-full border border-white/10" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col px-6 pb-24 pt-8 sm:px-10">
          <nav className="flex items-center justify-between">
            <LogoMark
              className="text-white"
              wordmarkClassName="text-lg text-white"
            />
            <div className="flex items-center gap-3">
              <ThemeToggle variant="onDark" />
              <Link
                href="/signin"
                className="rounded-full border border-white/25 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gold-500 px-5 py-2 text-sm font-semibold text-pitch-950 transition hover:bg-gold-400"
              >
                Join Pitch Diary
              </Link>
            </div>
          </nav>

          <div className="mx-auto mt-16 flex max-w-2xl flex-col items-center text-center sm:mt-24">
            <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold-300">
              Built for grassroots football
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
              Track your grassroots
              <br />
              football journey
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/70">
              Log matches, stats, and your best moments — all in one place.
              Pitch Diary is the simple way to keep a record of your season.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-full bg-gold-500 px-8 py-3.5 text-center text-base font-semibold text-pitch-950 shadow-lg shadow-gold-500/20 transition hover:bg-gold-400"
              >
                Join Pitch Diary
              </Link>
              <Link
                href="/signin"
                className="rounded-full border border-white/25 px-8 py-3.5 text-center text-base font-semibold text-white transition hover:bg-white/10"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto -mt-14 w-full max-w-6xl px-6 sm:px-10">
          <div className="grid gap-5 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-cream-300 bg-cream-100 p-7 shadow-[0_1px_2px_rgba(16,35,26,0.04)] transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pitch-900 text-gold-400">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/60">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-4xl px-6 pb-24 text-center sm:px-10">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Every season starts with a first entry
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-ink/60">
            Create your free account, tell us a bit about how you play, and
            start building your diary today.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-full bg-pitch-900 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-pitch-800"
          >
            Get Started — It&apos;s Free
          </Link>
        </section>
      </main>

      <footer className="border-t border-cream-300 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 sm:flex-row sm:px-10">
          <LogoMark
            className="text-ink"
            wordmarkClassName="text-sm text-ink"
          />
          <p className="text-xs text-ink/50">
            Pitch Diary — track your grassroots football journey.
          </p>
        </div>
      </footer>
    </div>
  );
}
