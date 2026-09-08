import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo / brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl" role="img" aria-label="football">
            🏈
          </span>
          <span className="font-bold text-base tracking-tight text-foreground group-hover:text-accent transition-colors">
            CFB <span className="text-accent">Ranked</span>
          </span>
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
