import { TeamData } from "./RankingsTable";
import { FAQ_ITEMS } from "./FAQSection";

interface RankingsJsonLdProps {
  rankings: TeamData[];
  weekTitle?: string;
  weekNumber?: number;
  publishedDate?: string | null;
  lastUpdatedDate?: string | null;
}

export function RankingsJsonLd({
  rankings,
  weekTitle = "Top 25 Rankings",
  weekNumber = 1,
  publishedDate,
  lastUpdatedDate,
}: RankingsJsonLdProps) {
  const effectivePublished = publishedDate || "2026-09-02T16:00:00.000Z";
  const effectiveModified = lastUpdatedDate || new Date().toISOString();

  // 1. ItemList Schema for Top 25 College Football Rankings
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `College Football Rankings 2026 - ${weekTitle} Top 25 Poll`,
    description: `Official consensus college football Top 25 rankings for ${weekTitle} of the 2026 season voted on by fans and analysts.`,
    url: "https://collegefootballranked.com",
    numberOfItems: rankings.length,
    datePublished: effectivePublished,
    dateModified: effectiveModified,
    itemListElement: rankings.map((team) => ({
      "@type": "ListItem",
      position: team.rank,
      name: `${team.name} Football`,
      item: {
        "@type": "SportsTeam",
        name: team.name,
        sport: "American Football",
        parentOrganization: {
          "@type": "SportsOrganization",
          name: team.conference || "NCAA Division I FBS",
        },
        award: `Rank #${team.rank} (${team.points} points${
          team.firstPlaceVotes ? `, ${team.firstPlaceVotes} 1st place votes` : ""
        })`,
      },
    })),
  };

  // 2. FAQPage Schema for Rich Search Results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  // 3. WebSite / SportsOrganization Schema
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "College Football Ranked",
    alternateName: ["CFR", "College Football Top 25", "CFB Rankings"],
    url: "https://collegefootballranked.com",
    description:
      "Live democratic consensus college football rankings, weekly Top 25 polls, community ballots, and expert discussions.",
    publisher: {
      "@type": "Organization",
      name: "College Football Ranked",
      url: "https://collegefootballranked.com",
      logo: "https://collegefootballranked.com/icon.svg",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
    </>
  );
}
