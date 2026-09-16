"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { TeamLogo } from "./TeamLogo";
import { toPng, toBlob } from "html-to-image";

export interface RankedTeamInfo {
  rank: number;
  id: string;
  name: string;
  shortName: string;
  mascot: string | null;
  conference: string;
  record: string;
  primaryColor: string | null;
  logoUrl?: string | null | undefined;
}

interface BallotShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekTitle: string;
  weekNumber?: number;
  username: string;
  rankedTeams: RankedTeamInfo[];
  onContinueToRankings?: () => void;
}

export function BallotShareModal({
  isOpen,
  onClose,
  weekTitle,
  weekNumber = 1,
  username,
  rankedTeams,
  onContinueToRankings,
}: BallotShareModalProps) {
  const graphicRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState("");
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      setIsMobileDevice(isMobile);

      if (typeof navigator.share === "function") {
        setCanNativeShare(true);
      }
    }
  }, []);

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    if (!graphicRef.current) return null;
    try {
      setIsGenerating(true);
      // Brief pause to ensure all webfonts and images are ready in DOM
      await new Promise((r) => setTimeout(r, 150));

      const blob = await toBlob(graphicRef.current, {
        pixelRatio: 2.5,
        cacheBust: false,
        backgroundColor: "#0d1117",
      });

      if (blob) {
        const url = URL.createObjectURL(blob);
        setPreviewDataUrl(url);
      }
      return blob;
    } catch (err) {
      console.error("Failed to generate ballot graphic:", err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && rankedTeams.length >= 25) {
      setPreviewDataUrl(null);
      const t = setTimeout(() => {
        generateImage();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, rankedTeams, generateImage]);

  if (!isOpen || rankedTeams.length < 25) return null;

  const team1 = rankedTeams[0];
  const teams2to25 = rankedTeams.slice(1, 25);

  const handleDownload = async () => {
    if (!graphicRef.current) return;
    try {
      setIsGenerating(true);
      const blob = await generateImage();
      if (!blob) throw new Error("Could not generate image blob");

      const file = new File([blob], `my-top-25-ballot-week-${weekNumber}.png`, {
        type: "image/png",
      });

      // On mobile iOS/Safari, native share is the most reliable way to save to Camera Roll
      if (
        isMobileDevice &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: `My Week ${weekNumber} Top 25 Ballot`,
          files: [file],
        });
        setCopiedNotification("Shared / Saved to Photos!");
        setTimeout(() => setCopiedNotification(""), 3000);
        return;
      }

      // Standard browser download trigger using Blob URL
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `my-top-25-ballot-week-${weekNumber}.png`;
      link.href = blobUrl;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 2000);

      setCopiedNotification("Image downloaded!");
      setTimeout(() => setCopiedNotification(""), 3000);
    } catch (e) {
      console.error("Download error:", e);
      // Fallback: try direct PNG data url
      try {
        const dataUrl = await toPng(graphicRef.current, {
          pixelRatio: 2.5,
          backgroundColor: "#0d1117",
        });
        const w = window.open("");
        if (w) {
          w.document.write(
            `<img src="${dataUrl}" style="max-width:100%;height:auto;" />`
          );
        }
      } catch (err2) {
        console.error("Fallback image open error:", err2);
      }
      setCopiedNotification("Please long-press the image to save");
      setTimeout(() => setCopiedNotification(""), 4000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyImage = async () => {
    try {
      setIsGenerating(true);
      const blob = await generateImage();
      if (!blob) throw new Error("Could not create blob");

      if (
        typeof ClipboardItem !== "undefined" &&
        navigator.clipboard &&
        navigator.clipboard.write
      ) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        setCopiedNotification("Copied image to clipboard!");
      } else {
        handleDownload();
      }
      setTimeout(() => setCopiedNotification(""), 3000);
    } catch (e) {
      console.error("Failed to copy to clipboard:", e);
      handleDownload();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsGenerating(true);
      const blob = await generateImage();
      if (!blob) throw new Error("Could not create blob");

      const file = new File([blob], `my-top-25-week-${weekNumber}.png`, {
        type: "image/png",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `My Week ${weekNumber} College Football Top 25 Ballot`,
          text: `Check out my official Top 25 ballot for ${weekTitle} on College Football Ranked!`,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `My Week ${weekNumber} College Football Top 25 Ballot`,
          text: `Check out my official Top 25 ballot for ${weekTitle} on College Football Ranked!`,
          url: window.location.origin,
        });
      } else {
        handleDownload();
      }
    } catch (e) {
      console.log("Share action ended:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/85 backdrop-blur-md p-2 sm:p-4 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#11141a] max-w-lg w-full max-h-[96vh] flex flex-col rounded-2xl border border-border shadow-2xl overflow-hidden animate-scale-up z-10 my-auto">
        {/* Modal Header */}
        <div className="p-3.5 sm:px-5 sm:py-3.5 border-b border-border/80 flex items-center justify-between shrink-0 bg-[#151922]">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 text-accent flex items-center justify-center text-sm">
              🎉
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-foreground leading-tight">
                Share Your Top 25 Ballot
              </h2>
              <p className="text-[11px] text-muted">
                Portrait graphic formatted for stories & mobile sharing.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-elevated text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: Visual Preview */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col items-center justify-center bg-[#0d1017]">
          {/* Action notification toast */}
          {copiedNotification && (
            <div className="mb-2 px-3.5 py-1 rounded-full bg-accent text-background font-bold text-xs shadow-lg animate-bounce">
              ✓ {copiedNotification}
            </div>
          )}

          {/* Graphic Preview Container - Auto scales cleanly on all mobile & desktop viewports */}
          <div className="w-full flex flex-col items-center justify-center">
            {/* If high-res preview image is ready, show it with touch/long-press save support on mobile */}
            {previewDataUrl ? (
              <div className="relative max-h-[62vh] max-w-full flex items-center justify-center rounded-xl overflow-hidden shadow-2xl border border-[#2d3748]">
                <img
                  src={previewDataUrl}
                  alt="My Top 25 Ballot Graphic"
                  className="max-h-[62vh] w-auto object-contain rounded-xl"
                />
              </div>
            ) : null}

            {/* Mobile Long Press Tip */}
            {isMobileDevice && (
              <p className="text-[10px] text-muted/80 mt-2 text-center">
                💡 Tip: Tap &ldquo;Share / Save&rdquo; or press and hold the image to save to Photos.
              </p>
            )}

            {/* The actual HTML graphic template that gets captured by html-to-image */}
            {/* Kept in DOM with exact portrait styling */}
            <div
              className={`w-full flex items-center justify-center ${
                previewDataUrl ? "absolute -left-[9999px] pointer-events-none" : ""
              }`}
            >
              <div
                ref={graphicRef}
                className="w-[440px] shrink-0 rounded-2xl p-4 border border-[#2d3748] shadow-2xl text-white select-none relative overflow-hidden"
                style={{
                  backgroundColor: "#0d1117",
                  backgroundImage:
                    "radial-gradient(circle at 50% 0%, rgba(201,168,76,0.18) 0%, transparent 55%), radial-gradient(circle at 50% 100%, rgba(26,32,44,0.85) 0%, transparent 65%)",
                }}
              >
                {/* Graphic Top Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-background font-black text-xs shadow-md">
                      🏈
                    </div>
                    <div>
                      <div className="text-[10px] font-black tracking-widest text-accent uppercase leading-tight">
                        COLLEGE FOOTBALL RANKED
                      </div>
                      <div className="text-xs font-extrabold text-white tracking-tight leading-tight">
                        OFFICIAL TOP 25 BALLOT
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold text-white uppercase inline-block">
                      {weekTitle}
                    </div>
                    <div className="text-[9px] text-white/60 font-mono mt-0.5">
                      @{username}
                    </div>
                  </div>
                </div>

                {/* #1 TEAM FEATURED HERO BANNER */}
                {team1 && (
                  <div
                    className="mb-2.5 p-2.5 rounded-xl border border-accent/60 shadow-lg relative overflow-hidden flex items-center justify-between gap-3"
                    style={{
                      background: team1.primaryColor
                        ? `linear-gradient(135deg, ${team1.primaryColor}38 0%, rgba(20,24,33,0.95) 100%)`
                        : "linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(20,24,33,0.95) 100%)",
                    }}
                  >
                    {/* Subtle Background Glow */}
                    <div
                      className="absolute -right-6 -top-6 w-28 h-28 rounded-full blur-2xl opacity-40 pointer-events-none"
                      style={{
                        backgroundColor: team1.primaryColor || "#c9a84c",
                      }}
                    />

                    {/* Left Side: Rank 1 Badge + Logo */}
                    <div className="flex items-center gap-2.5 z-10 min-w-0">
                      <div className="flex flex-col items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-b from-amber-300 to-amber-500 text-background font-black shadow-md shrink-0">
                        <span className="text-[8px] uppercase tracking-wider font-extrabold opacity-80 leading-none">
                          NO.
                        </span>
                        <span className="text-base font-black leading-none">1</span>
                      </div>

                      <TeamLogo
                        logoUrl={team1.logoUrl}
                        name={team1.name}
                        shortName={team1.shortName}
                        primaryColor={team1.primaryColor}
                        size={46}
                      />

                      <div className="min-w-0">
                        <div className="text-sm font-black tracking-tight text-white truncate max-w-[210px]">
                          {team1.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-white/70 font-semibold mt-0.5">
                          <span className="text-accent font-bold">
                            {team1.record}
                          </span>
                          <span>•</span>
                          <span>{team1.conference}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Star Badge */}
                    <div className="flex flex-col items-end shrink-0 z-10 pr-1">
                      <span className="text-[10px] font-black text-accent tracking-wider uppercase">
                        ★ TOP RANK ★
                      </span>
                    </div>
                  </div>
                )}

                {/* REMAINING 24 TEAMS (3 COLUMNS × 8 ROWS) */}
                <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                  {teams2to25.map((team) => (
                    <div
                      key={team.rank}
                      className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] shadow-xs"
                    >
                      {/* Rank Badge */}
                      <div className="w-4 h-4 rounded-md bg-white/10 border border-white/15 flex items-center justify-center text-[9px] font-black text-white shrink-0 font-mono">
                        {team.rank}
                      </div>

                      {/* Logo */}
                      <TeamLogo
                        logoUrl={team.logoUrl}
                        name={team.name}
                        shortName={team.shortName}
                        primaryColor={team.primaryColor}
                        size={20}
                      />

                      {/* Name & Record */}
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold text-white truncate leading-tight">
                          {team.shortName || team.name}
                        </div>
                        <div className="text-[8px] text-white/50 font-medium truncate leading-tight flex items-center gap-1">
                          <span className="text-accent/90 font-bold">{team.record}</span>
                          <span>•</span>
                          <span>{team.conference}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Graphic Footer Watermark */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[8px] text-white/50 font-mono">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>CollegeFootballRanked.com</span>
                  </div>
                  <span>Week {weekNumber} Official Ballot</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3 sm:px-5 border-t border-border/80 bg-[#151922] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {/* Primary Action Button (Share or Download) */}
            <button
              type="button"
              onClick={canNativeShare ? handleShare : handleDownload}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-accent text-background font-bold text-xs hover:bg-accent-glow transition-all flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
            >
              <span>{canNativeShare ? "📲" : "⬇️"}</span>
              <span>{canNativeShare ? "Share / Save" : "Download PNG"}</span>
            </button>

            {/* If Native Share is supported, also offer explicit Download */}
            {canNativeShare && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={isGenerating}
                className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-white/15 text-foreground border border-border font-semibold text-xs transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <span>⬇️</span>
                <span>Download</span>
              </button>
            )}

            {/* Copy image button for desktop */}
            {!isMobileDevice && (
              <button
                type="button"
                onClick={handleCopyImage}
                disabled={isGenerating}
                className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-white/15 text-foreground border border-border font-semibold text-xs transition-all items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <span>📋</span>
                <span>Copy</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-border text-muted hover:text-foreground text-xs font-medium transition-colors"
            >
              Close
            </button>

            {onContinueToRankings && (
              <button
                type="button"
                onClick={onContinueToRankings}
                className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-white/10 text-accent font-bold text-xs border border-accent/40 transition-all flex items-center gap-1"
              >
                <span>Rankings</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
