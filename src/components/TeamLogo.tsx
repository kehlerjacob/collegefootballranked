"use client";

import { useState } from "react";

interface TeamLogoProps {
  logoUrl?: string | null;
  name: string;
  shortName?: string;
  primaryColor?: string | null;
  size?: number;
  className?: string;
}

export function TeamLogo({
  logoUrl,
  name,
  shortName,
  primaryColor = "#353b48",
  size = 34,
  className = "",
}: TeamLogoProps) {
  const [hasError, setHasError] = useState(false);
  const initials = shortName || name.slice(0, 3).toUpperCase();

  // If a logoUrl exists and hasn't errored, show the image on a crisp white background
  if (logoUrl && !hasError) {
    return (
      <div
        className={`relative shrink-0 flex items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-white/20 p-1 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="w-full h-full object-contain"
          onError={() => setHasError(true)}
          loading="eager"
          decoding="sync"
          crossOrigin="anonymous"
        />
      </div>
    );
  }

  // Fallback colored badge with team initials
  return (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center font-bold text-background text-xs shadow-sm ring-1 ring-white/10 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: primaryColor || "#353b48",
      }}
      title={name}
    >
      {initials.slice(0, 3)}
    </div>
  );
}
