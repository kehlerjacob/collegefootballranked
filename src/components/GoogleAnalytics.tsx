import Script from "next/script";

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Utility function to track custom user interactions
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
  params?: Record<string, any>
) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      ...params,
    });
  }
}

// Track sign up conversions in GA4
export function trackSignUp(method: string = "credentials", favoriteTeam?: string) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "sign_up", {
      method,
      favorite_team: favoriteTeam,
    });
  }
}

// Track weekly ballot submissions in GA4
export function trackBallotSubmission(weekNumber: number, teamCount: number = 25, isUpdate: boolean = false) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", isUpdate ? "ballot_updated" : "ballot_submitted", {
      event_category: "Engagement",
      week_number: weekNumber,
      team_count: teamCount,
      value: 1,
    });
  }
}
