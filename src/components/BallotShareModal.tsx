"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { TeamLogo } from "./TeamLogo";
import { CFRLogo } from "./CFRLogo";
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
  secondaryLogoUrl?: string | null | undefined;
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

// Preload team logo URLs into browser memory cache
async function preloadImages(urls: (string | null | undefined)[]): Promise<void> {
  const validUrls = urls.filter((u): u is string => Boolean(u));
  await Promise.all(
    validUrls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
          if (img.complete) resolve();
        })
    )
  );
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

      // 1. Preload all team primary logos & secondary mascot logos
      await preloadImages([
        ...rankedTeams.map((t) => t.logoUrl),
        ...rankedTeams.map((t) => t.secondaryLogoUrl),
      ]);

      // 2. Wait for all <img> tags in graphicRef to finish loading
      const imgElements = Array.from(graphicRef.current.querySelectorAll("img"));
      await Promise.all(
        imgElements.map((img) => {
          if (img.complete && img.naturalWidth > 0) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            setTimeout(resolve, 800);
          });
        })
      );

      // 3. Brief stabilization delay
      await new Promise((r) => setTimeout(r, 100));

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
  }, [rankedTeams]);

  useEffect(() => {
    if (isOpen && rankedTeams.length >= 25) {
      setPreviewDataUrl(null);
      // Small timeout for initial modal mount
      const t = setTimeout(() => {
        generateImage();
      }, 150);
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
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground leading-tight">
              Share Your Top 25 Picks
            </h2>
            <p className="text-[11px] text-muted">
              Portrait graphic formatted for stories &amp; mobile sharing.
            </p>
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

          {/* Stable Fixed Aspect-Ratio Container to Prevent ANY Layout Shift */}
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full max-w-[340px] sm:max-w-[380px] aspect-[440/730] max-h-[62vh] relative flex items-center justify-center overflow-hidden">
              {previewDataUrl ? (
                <img
                  src={previewDataUrl}
                  alt="My Top 25 Ballot Graphic"
                  className="w-full h-full object-contain rounded-2xl drop-shadow-2xl animate-fade-in"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 p-6 text-center text-muted">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin shadow-md" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Preparing your Top 25 graphic...</p>
                    <p className="text-[10px] text-muted mt-0.5">Loading official logos & colors</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Long Press Tip */}
            {isMobileDevice && (
              <p className="text-[10px] text-muted/80 mt-2 text-center flex items-center justify-center gap-1">
                <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Tip: Tap &ldquo;Share / Save&rdquo; or press and hold the image to save to Photos.</span>
              </p>
            )}

            {/* Hidden Permanent Off-Screen High-Res Render Node for html-to-image */}
            <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0 select-none">
              <div
                ref={graphicRef}
                className="w-[440px] rounded-2xl p-4 border border-[#2d3748] shadow-2xl text-white relative overflow-hidden"
                style={{
                  backgroundColor: "#0d1117",
                  backgroundImage:
                    "radial-gradient(circle at 50% 0%, rgba(201,168,76,0.18) 0%, transparent 55%), radial-gradient(circle at 50% 100%, rgba(26,32,44,0.85) 0%, transparent 65%)",
                }}
              >
                {/* Graphic Top Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <CFRLogo height={28} />
                    <div className="border-l border-white/15 pl-2.5 py-0.5">
                      <div className="text-[9.5px] font-black tracking-widest text-accent uppercase leading-tight">
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
                        ? `linear-gradient(135deg, ${team1.primaryColor}40 0%, rgba(20,24,33,0.96) 65%, ${team1.primaryColor}22 100%)`
                        : "linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(20,24,33,0.96) 100%)",
                    }}
                  >
                    {/* Left Side: Rank 1 Badge + Primary Logo + Team Info */}
                    <div className="flex items-center gap-2.5 z-10 min-w-0 flex-1">
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

                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-black tracking-tight text-white truncate">
                          {team1.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-white/70 font-semibold mt-0.5">
                          <span className="text-accent font-bold">
                            {team1.record}
                          </span>
                          <span>•</span>
                          <span>{team1.conference}</span>
                          {team1.mascot && (
                            <>
                              <span>•</span>
                              <span className="text-white/60 truncate">{team1.mascot}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Mascot Logo Accent */}
                    <div className="flex items-center gap-2 shrink-0 z-10 pr-0.5">
                      {(team1.secondaryLogoUrl || team1.logoUrl) && (
                        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 p-1">
                          <img
                            src={team1.secondaryLogoUrl || team1.logoUrl!}
                            alt={team1.mascot || `${team1.name} Mascot`}
                            className="w-full h-full object-contain drop-shadow"
                            crossOrigin="anonymous"
                            loading="eager"
                            decoding="sync"
                          />
                        </div>
                      )}
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
            {/* Share Button (Both Mobile and Desktop) */}
            <button
              type="button"
              onClick={handleShare}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-accent text-background font-bold text-xs hover:bg-accent-glow transition-all flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share</span>
            </button>

            {/* Download Button (Desktop only) */}
            {!isMobileDevice && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={isGenerating}
                className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-white/15 text-foreground border border-border font-semibold text-xs transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download</span>
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
