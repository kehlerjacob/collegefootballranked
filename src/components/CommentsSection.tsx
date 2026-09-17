"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthProvider";
import { CommentItem, CommentData } from "./CommentItem";
import { TeamLogo } from "./TeamLogo";
import Link from "next/link";

interface CommentsSectionProps {
  weekId?: string;
  weekTitle?: string;
}

export function CommentsSection({ weekId, weekTitle }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [inputContent, setInputContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load comments for the selected week
  const loadComments = useCallback(async () => {
    if (!weekId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/comments?weekId=${weekId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
        setTotalCount(data.totalCount || 0);
      }
    } catch (e) {
      console.error("Failed to load comments:", e);
    } finally {
      setIsLoading(false);
    }
  }, [weekId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Handle posting a new top-level comment
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmed = inputContent.trim();
    if (!trimmed || !weekId) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekId,
          content: trimmed,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to post comment");
        return;
      }

      // Prepend to comments list
      setComments((prev) => [data.comment, ...prev]);
      setTotalCount((prev) => prev + 1);
      setInputContent("");
    } catch {
      setErrorMsg("Network error posting comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reply added
  const handleReplyAdded = (parentId: string, newReply: CommentData) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === parentId) {
          return {
            ...c,
            replyCount: (c.replyCount || 0) + 1,
            replies: [...(c.replies || []), newReply],
          };
        }
        return c;
      })
    );
    setTotalCount((prev) => prev + 1);
  };

  // Handle comment deleted
  const handleCommentDeleted = (commentId: string, parentId?: string | null) => {
    if (!parentId) {
      // Top-level comment deleted
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } else {
      // Child reply deleted
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === parentId) {
            return {
              ...c,
              replyCount: Math.max(0, (c.replyCount || 1) - 1),
              replies: (c.replies || []).filter((r) => r.id !== commentId),
            };
          }
          return c;
        })
      );
    }
    setTotalCount((prev) => Math.max(0, prev - 1));
  };

  if (!weekId) return null;

  return (
    <div className="glass-card rounded-lg p-5 sm:p-6 mt-6 border border-border/70 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Comments
          </h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface border border-border text-accent">
            {totalCount}
          </span>
        </div>

        <span className="text-[11px] text-muted hidden sm:inline">
          {weekTitle ? `${weekTitle} Rankings` : "Live Thread"}
        </span>
      </div>

      {/* Comment Input Composer */}
      <div className="pt-4 pb-2">
        {user ? (
          <form onSubmit={handlePostComment} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div className="relative shrink-0">
                <div
                  className={`w-8 h-8 rounded-full ${
                    user.favoriteTeam?.primaryColor
                      ? "text-white"
                      : "bg-accent/20 border border-accent/40 text-accent"
                  } flex items-center justify-center text-xs font-black shadow-sm`}
                  style={
                    user.favoriteTeam?.primaryColor
                      ? { backgroundColor: user.favoriteTeam.primaryColor }
                      : undefined
                  }
                >
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                {user.favoriteTeam && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-background border border-border flex items-center justify-center shadow-xs overflow-hidden">
                    <TeamLogo
                      logoUrl={user.favoriteTeam.logoUrl}
                      name={user.favoriteTeam.name}
                      shortName={user.favoriteTeam.shortName}
                      primaryColor={user.favoriteTeam.primaryColor}
                      size={13}
                    />
                  </div>
                )}
              </div>

              {/* Input field */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder={`Add a comment on ${weekTitle || "rankings"}...`}
                  maxLength={500}
                  className="w-full px-3.5 py-2 rounded-md bg-surface border border-border text-foreground text-xs placeholder:text-muted/60 focus:outline-none focus:border-accent transition-colors pr-16"
                />
                <button
                  type="submit"
                  disabled={!inputContent.trim() || isSubmitting}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md bg-accent text-background font-bold text-[11px] hover:bg-accent-glow transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSubmitting ? "..." : "Post"}
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-[11px] text-danger ml-11 font-medium">
                {errorMsg}
              </p>
            )}
          </form>
        ) : (
          <div className="p-3.5 rounded-md bg-surface/60 border border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>
                <strong>Join the discussion:</strong> Sign in to leave a comment, reply, and like rankings reactions.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/login"
                className="px-4 py-2 rounded-md bg-accent text-background font-bold hover:bg-accent-glow transition-all text-xs whitespace-nowrap min-w-[5rem] text-center"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-md bg-surface border border-border text-muted hover:text-foreground font-semibold transition-all text-xs whitespace-nowrap min-w-[5rem] text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="mt-4 pt-3 border-t border-border/40">
        {isLoading ? (
          <div className="py-8 text-center text-xs text-muted animate-pulse">
            Loading comments...
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-5 divide-y divide-border/30">
            {comments.map((comment) => (
              <div key={comment.id} className="pt-4 first:pt-0">
                <CommentItem
                  comment={comment}
                  weekId={weekId}
                  onReplyAdded={handleReplyAdded}
                  onCommentDeleted={handleCommentDeleted}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-muted flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-muted">
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="font-semibold text-foreground/80">No comments yet</p>
            <p className="text-[11px]">
              Be the first to share your thoughts on the {weekTitle || "this week's"} Top 25 rankings!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
