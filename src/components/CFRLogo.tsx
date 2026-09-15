import React from "react";

interface CFRLogoProps {
  className?: string;
  height?: number | string;
  width?: number | string;
}

export function CFRLogo({ className = "", height = 32, width = "auto" }: CFRLogoProps) {
  return (
    <svg
      viewBox="0 0 148 48"
      height={height}
      width={width}
      className={`inline-block select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CFR College Football Ranked Logo"
    >
      <defs>
        {/* Retro collegiate varsity gold gradient */}
        <linearGradient id="cfr-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Vintage leather / gold highlight */}
        <linearGradient id="cfr-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.4" />
        </linearGradient>

        {/* Athletic Drop Shadow */}
        <filter id="cfr-shadow" x="-8%" y="-8%" width="125%" height="130%">
          <feDropShadow dx="2" dy="3" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Retro Athletic 3D Block Shadow Layer */}
      <g transform="translate(2.5, 3)" fill="#090d14" opacity="0.95">
        {/* Shadow C */}
        <path d="M 12 3 L 34 3 L 42 11 L 42 16 L 31 16 L 31 12 L 20 12 L 20 34 L 31 34 L 31 30 L 42 30 L 42 35 L 34 43 L 12 43 L 4 35 L 4 11 Z" />
        {/* Shadow F */}
        <path d="M 52 3 L 92 3 L 92 14 L 81 14 L 81 12 L 67 12 L 67 21 L 84 21 L 84 30 L 67 30 L 67 43 L 52 43 Z" />
        {/* Shadow R */}
        <path d="M 102 3 L 134 3 L 144 13 L 144 23 L 136 29 L 145 43 L 130 43 L 122 30 L 117 30 L 117 43 L 102 43 Z M 117 12 L 117 21 L 128 21 L 131 18 L 131 15 L 128 12 Z" />
      </g>

      {/* Outer Contrast Border (Varsity Athletic White/Cream Outline) */}
      <g
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinejoin="miter"
        strokeMiterlimit="3"
        fill="none"
        opacity="0.9"
      >
        {/* Outer C */}
        <path d="M 12 3 L 34 3 L 42 11 L 42 16 L 31 16 L 31 12 L 20 12 L 20 34 L 31 34 L 31 30 L 42 30 L 42 35 L 34 43 L 12 43 L 4 35 L 4 11 Z" />
        {/* Outer F */}
        <path d="M 52 3 L 92 3 L 92 14 L 81 14 L 81 12 L 67 12 L 67 21 L 84 21 L 84 30 L 67 30 L 67 43 L 52 43 Z" />
        {/* Outer R */}
        <path d="M 102 3 L 134 3 L 144 13 L 144 23 L 136 29 L 145 43 L 130 43 L 122 30 L 117 30 L 117 43 L 102 43 Z M 117 12 L 117 21 L 128 21 L 131 18 L 131 15 L 128 12 Z" />
      </g>

      {/* Main Collegiate Block Fill (Gold / Amber Athletic Gradient) */}
      <g fill="url(#cfr-gold)" stroke="#78350F" strokeWidth="1" strokeLinejoin="miter">
        {/* Varsity C */}
        <path d="M 12 3 L 34 3 L 42 11 L 42 16 L 31 16 L 31 12 L 20 12 L 20 34 L 31 34 L 31 30 L 42 30 L 42 35 L 34 43 L 12 43 L 4 35 L 4 11 Z" />
        {/* Varsity F */}
        <path d="M 52 3 L 92 3 L 92 14 L 81 14 L 81 12 L 67 12 L 67 21 L 84 21 L 84 30 L 67 30 L 67 43 L 52 43 Z" />
        {/* Varsity R */}
        <path d="M 102 3 L 134 3 L 144 13 L 144 23 L 136 29 L 145 43 L 130 43 L 122 30 L 117 30 L 117 43 L 102 43 Z M 117 12 L 117 21 L 128 21 L 131 18 L 131 15 L 128 12 Z" />
      </g>

      {/* Subtle Retro Top Bevel / Highlight Sheen */}
      <g fill="url(#cfr-highlight)" opacity="0.65">
        {/* C Top Chamfer Highlight */}
        <polygon points="12,3 34,3 38,7 15,7 7,15 4,11" />
        {/* F Top Bar Highlight */}
        <polygon points="52,3 92,3 88,7 56,7 56,21 52,21" />
        {/* R Top Bar Highlight */}
        <polygon points="102,3 134,3 139,8 106,8 106,25 102,25" />
      </g>
    </svg>
  );
}
