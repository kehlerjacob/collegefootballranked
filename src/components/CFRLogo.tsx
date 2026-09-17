"use client";

import React, { useId } from "react";
import { useAuth } from "./AuthProvider";
import logoPaths from "./cfr-logo-paths.json";

interface CFRLogoProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  /** Optional custom hex color override. Defaults to user's favorite team primaryColor, or collegiate gold. */
  primaryColor?: string;
}

// Utility to brighten or deepen hex colors for dynamic gradients
function adjustBrightness(hex: string, percent: number): string {
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return hex;

  let r = (num >> 16) + Math.round((255 * percent) / 100);
  let g = ((num >> 8) & 0x00ff) + Math.round((255 * percent) / 100);
  let b = (num & 0x0000ff) + Math.round((255 * percent) / 100);

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function CFRLogo({
  className = "",
  height = 32,
  width = "auto",
  primaryColor: propPrimaryColor,
}: CFRLogoProps) {
  const { user } = useAuth();
  const idPrefix = useId().replace(/:/g, "");

  // Determine active primary color
  const activeColor =
    propPrimaryColor || user?.favoriteTeam?.primaryColor || null;

  // Gradient stops
  const isCustomColor = Boolean(activeColor && activeColor.startsWith("#"));
  const lightStop = isCustomColor
    ? adjustBrightness(activeColor!, 22)
    : "#FDE047";
  const midStop = isCustomColor ? activeColor! : "#F59E0B";
  const darkStop = isCustomColor
    ? adjustBrightness(activeColor!, -20)
    : "#D97706";

  const gradId = `cfr-grad-${idPrefix}`;
  const shadowId = `cfr-shadow-${idPrefix}`;

  return (
    <svg
      viewBox="46.5 27 720.5 388"
      height={height}
      width={width}
      className={`inline-block select-none transition-all duration-300 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="College Football Ranked Logo"
    >
      <defs>
        {/* Dynamic collegiate athletic gradient */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lightStop} />
          <stop offset="50%" stopColor={midStop} />
          <stop offset="100%" stopColor={darkStop} />
        </linearGradient>

        {/* Athletic Shadow Filter */}
        <filter id={shadowId} x="-10%" y="-10%" width="130%" height="135%">
          <feDropShadow
            dx="4"
            dy="8"
            stdDeviation="4"
            floodColor="#000000"
            floodOpacity="0.75"
          />
        </filter>
      </defs>

      {/* 3D Depth Shadow Background */}
      <g
        transform="translate(4, 7)"
        fill="#05070a"
        opacity="0.9"
        filter={`url(#${shadowId})`}
      >
        <path d={logoPaths.outerBorder} fillRule="nonzero" />
        <path d={logoPaths.counterR} fillRule="nonzero" />
      </g>

      {/* Outer Contrast Border (Collegiate Varsity White Outline) */}
      <path
        d={logoPaths.outerBorder}
        fill="#FFFFFF"
        fillOpacity="0.96"
        fillRule="nonzero"
      />
      <path
        d={logoPaths.counterR}
        fill="#FFFFFF"
        fillOpacity="0.96"
        fillRule="nonzero"
      />

      {/* Main Varsity Block Fill (Dynamic Team Primary Gradient or Gold) */}
      <path
        d={logoPaths.innerFill}
        fill={`url(#${gradId})`}
        fillRule="nonzero"
        className="transition-[fill] duration-500"
      />
    </svg>
  );
}
