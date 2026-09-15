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

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function" && typeof navigator.canShare === "function") {
      setCanNativeShare(true);
    }
  }, []);

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    if (!graphicRef.current) return null;
    try {
      setIsGenerating(true);
      // Wait for fonts & images to render
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
  }, []);

  useEffect(() => {
    if (isOpen && rankedTeams.length >= 25) {
      // Delay slightly for modal layout to stabilize before capturing
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
      const dataUrl = await toPng(graphicRef.current, {
        pixelRatio: 3,
        cacheBust: false,
        backgroundColor: "#0d1117",
      });
      const link = document.createElement("a");
      link.download = `my-top-25-ballot-week-${weekNumber}.png`;
      link.href = dataUrl;
      link.click();
      setCopiedNotification("Image downloaded!");
      setTimeout(() => setCopiedNotification(""), 3000);
    } catch (e) {
      console.error(e);
      setCopiedNotification("Error creating download");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyImage = async () => {
    try {
      setIsGenerating(true);
      const blob = await generateImage();
      if (!blob) throw new Error("Could not create blob");

      if (typeof ClipboardItem !== "undefined" && navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        setCopiedNotification("Copied image to clipboard!");
      } else {
        // Fallback: download
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
      // User cancelled share or error
      console.log("Share action ended:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#11141a] max-w-2xl w-full max-h-[92vh] flex flex-col rounded-2xl border border-border shadow-2xl overflow-hidden animate-scale-up z-10 my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-border/80 flex items-center justify-between shrink-0 bg-[#151922]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center text-base">
              🎉
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                Ballot Submitted! Share Your Top 25
              </h2>
              <p className="text-xs text-muted">
                Share your graphic on social media, group chats, or stories.
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center bg-[#0d1017]">
          {/* Action notification toast */}
          {copiedNotification && (
            <div className="mb-3 px-4 py-1.5 rounded-full bg-accent text-background font-bold text-xs shadow-lg animate-bounce">
              ✓ {copiedNotification}
            </div>
          )}

          {/* Graphic Preview Container with Scroll / Scale */}
          <div className="w-full flex items-center justify-center overflow-x-auto py-2">
            {/* The actual HTML graphic template that gets captured into an image */}
            <div
              ref={graphicRef}
              className="w-[620px] shrink-0 rounded-2xl p-5 border border-[#2d3748] shadow-2xl text-white select-none relative overflow-hidden"
              style={{
                backgroundColor: "#0d1117",
                backgroundImage:
                  "radial-gradient(circle at 50% 0%, rgba(201,168,76,0.15) 0%, transparent 60%), radial-gradient(circle at 50% 100%, rgba(26,32,44,0.8) 0%, transparent 70%)",
              }}
            >
              {/* Graphic Top Header */}
              <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-background font-black text-sm shadow-md">
                    🏈
                  </div>
                  <div>
                    <div className="text-[11px] font-black tracking-widest text-accent uppercase">
                      COLLEGE FOOTBALL RANKED
                    </div>
                    <div className="text-sm font-extrabold text-white tracking-tight">
                      OFFICIAL TOP 25 BALLOT
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-white uppercase inline-block">
                    {weekTitle}
                  </div>
                  <div className="text-[10px] text-white/60 font-mono mt-0.5">
                    @{username}
                  </div>
                </div>
              </div>

              {/* #1 TEAM FEATURED HERO BANNER */}
              {team1 && (
                <div
                  className="mb-3 p-3.5 rounded-xl border border-accent/50 shadow-lg relative overflow-hidden flex items-center justify-between gap-4"
                  style={{
                    background: team1.primaryColor
                      ? `linear-gradient(135deg, ${team1.primaryColor}33 0%, rgba(20,24,33,0.95) 100%)`
                      : "linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(20,24,33,0.95) 100%)",
                  }}
                >
                  {/* Subtle Background Team Primary Glow */}
                  <div
                    className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-40 pointer-events-none"
                    style={{
                      backgroundColor: team1.primaryColor || "#c9a84c",
                    }}
                  />

                  {/* Left Side: Rank 1 Badge + Logo */}
                  <div className="flex items-center gap-3.5 z-10">
                    <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 text-background font-black shadow-md shrink-0">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-80 leading-none">
                        RANK
                      </span>
                      <span className="text-xl font-black leading-none">1</span>
                    </div>

                    <TeamLogo
                      logoUrl={team1.logoUrl}
                      name={team1.name}
                      shortName={team1.shortName}
                      primaryColor={team1.primaryColor}
                      size={54}
                    />

                    <div className="min-w-0">
                      <div className="text-base font-black tracking-tight text-white truncate max-w-[280px]">
                        {team1.name}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-white/70 font-semibold mt-0.5">
                        <span className="text-accent font-bold">
                          {team1.record}
                        </span>
                        <span>•</span>
                        <span>{team1.conference}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Featured Crown / Label */}
                  <div className="hidden sm:flex flex-col items-end shrink-0 z-10 pr-1">
                    <span className="text-xs font-black text-accent tracking-wider uppercase">
                      ★ NO. 1 OVERALL ★
                    </span>
                    <span className="text-[10px] text-white/50">
                      Top of the Ballot
                    </span>
                  </div>
                </div>
              )}

              {/* REMAINING 24 TEAMS (6 ROWS OF 4 TEAMS) */}
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {teams2to25.map((team) => (
                  <div
                    key={team.rank}
                    className="flex items-center gap-2 p-1.5 px-2 rounded-lg bg-white/[0.04] border border-white/[0.08] shadow-xs"
                  >
                    {/* Rank Badge */}
                    <div className="w-5 h-5 rounded-md bg-white/10 border border-white/15 flex items-center justify-center text-[10px] font-black text-white shrink-0 font-mono">
                      {team.rank}
                    </div>

                    {/* Logo */}
                    <TeamLogo
                      logoUrl={team.logoUrl}
                      name={team.name}
                      shortName={team.shortName}
                      primaryColor={team.primaryColor}
                      size={22}
                    />

                    {/* Name & Record */}
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-white truncate leading-tight">
                        {team.shortName || team.name}
                      </div>
                      <div className="text-[9px] text-white/50 font-medium truncate leading-tight flex items-center gap-1">
                        <span className="text-accent/90 font-bold">{team.record}</span>
                        <span>•</span>
                        <span>{team.conference}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Graphic Footer Watermark */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-white/50 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  <span>Vote & Compare at CollegeFootballRanked.com</span>
                </div>
                <span>Week {weekNumber} Official Voting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:px-6 border-t border-border/80 bg-[#151922] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {/* Share via native share API (Mobile / Stories / Messages) */}
            {canNativeShare && (
              <button
                type="button"
                onClick={handleShare}
                disabled={isGenerating}
                className="px-4 py-2 rounded-xl bg-accent text-background font-bold text-xs hover:bg-accent-glow transition-all flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
              >
                <span>📲</span>
                <span>Share Graphic</span>
              </button>
            )}

            {/* Download PNG */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 ${
                canNativeShare
                  ? "bg-surface-elevated hover:bg-white/15 text-foreground border border-border"
                  : "bg-accent text-background hover:bg-accent-glow shadow-md"
              }`}
            >
              <span>⬇️</span>
              <span>Download Image</span>
            </button>

            {/* Copy image button for desktop */}
            <button
              type="button"
              onClick={handleCopyImage}
              disabled={isGenerating}
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-white/15 text-foreground border border-border font-semibold text-xs transition-all items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <span>📋</span>
              <span>Copy Image</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-border text-muted hover:text-foreground text-xs font-medium transition-colors"
            >
              Close
            </button>

            {onContinueToRankings && (
              <button
                type="button"
                onClick={onContinueToRankings}
                className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-white/10 text-accent font-bold text-xs border border-accent/40 transition-all flex items-center gap-1"
              >
                <span>View Rankings</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
