import { RankingsTable } from "@/components/RankingsTable";
import { Header } from "@/components/Header";
import { WeekSelector } from "@/components/WeekSelector";
import { StatsBar } from "@/components/StatsBar";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pb-8">
        {/* Hero blurb */}
        <section className="pt-6 pb-4 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Power Rankings
          </h1>
          <p className="mt-1 text-sm text-muted">
            Community-voted Top 25 · Updated weekly
          </p>
        </section>

        {/* Week selector + stats */}
        <div className="flex flex-col gap-3 mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <WeekSelector />
          <StatsBar />
        </div>

        {/* Rankings table */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <RankingsTable />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted">
        <p>© {new Date().getFullYear()} College Football Ranked. All rights reserved.</p>
      </footer>
    </>
  );
}
