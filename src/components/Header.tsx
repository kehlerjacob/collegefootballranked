import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo / brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex flex-col items-start leading-none">
            <span className="text-xl font-black tracking-[0.08em] uppercase text-foreground group-hover:text-accent transition-colors duration-200" style={{ fontFamily: "var(--font-geist-sans), 'Impact', 'Arial Black', sans-serif", letterSpacing: "0.12em" }}>
              CFR
            </span>
            <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted group-hover:text-accent/70 transition-colors duration-200 mt-[-1px]">
              College Football Ranked
            </span>
          </div>
        </Link>

        {/* Nav actions */}
        <nav className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-muted hover:text-foreground hover:border-border-light transition-all duration-200"
            aria-label="Log in"
          >
            Log in
          </button>
          <button
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-accent text-background hover:bg-accent-glow transition-all duration-200 animate-pulse-glow"
            aria-label="Submit your ballot"
          >
            Submit Ballot
          </button>
        </nav>
      </div>
    </header>
  );
}
