"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { TeamLogo } from "./TeamLogo";

export interface CommentData {
  id: string;
  content: string;
  userId: string;
  username: string;
  userRole?: string;
  favoriteTeam?: {
    id: string;
    name: string;
    shortName: string;
    logoUrl?: string | null;
    primaryColor?: string | null;
  } | null;
  parentId?: string | null;
  createdAt: string;
  likeCount: number;
  replyCount?: number;
  hasLiked: boolean;
  replies?: CommentData[];
}

interface CommentItemProps {
  comment: CommentData;
  weekId: string;
  onReplyAdded: (parentId: string, newReply: CommentData) => void;
  onCommentDeleted: (commentId: string, parentId?: string | null) => void;
}

// Generate consistent avatar gradient from username
function getAvatarGradient(username: string) {
  const gradients = [
    "from-amber-500 to-red-600",
    "from-purple-500 to-indigo-600",
    "from-emerald-500 to-teal-700",
    "from-blue-500 to-cyan-600",
    "from-pink-500 to-rose-600",
    "from-orange-500 to-amber-600",
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

// Format relative time (TikTok / IG style: 2m, 3h, 1d)
function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const created = new Date(dateStr).getTime();
  const diffSec = Math.max(1, Math.floor((now - created) / 1000));

  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks}w`;

  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Format text with highlighted @mentions
function renderFormattedContent(text: string) {
  const parts = text.split(/(@[a-zA-Z0-9_]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith("@")) {
      return (
        <span key={i} className="text-accent font-semibold hover:underline">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function CommentItem({
  comment,
  weekId,
  onReplyAdded,
  onCommentDeleted,
}: CommentItemProps) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(comment.likeCount);
  const [hasLiked, setHasLiked] = useState(comment.hasLiked);
  const [isLiking, setIsLiking] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyError, setReplyError] = useState("");

  const [showRepliesThread, setShowRepliesThread] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const replies = comment.replies || [];
  const hasReplies = replies.length > 0;
  const isAuthor = user?.id === comment.userId;
  const isAdmin = user?.role === "ADMIN" || user?.email?.toLowerCase() === "kehlerjacob@gmail.com";

  // Handle Like Toggle with optimistic UI
  const handleLikeToggle = async () => {
    if (!user) {
      alert("Please log in to like comments!");
      return;
    }
    if (isLiking) return;

    // Optimistic state
    const nextHasLiked = !hasLiked;
    const nextLikes = nextHasLiked ? likes + 1 : Math.max(0, likes - 1);
    setHasLiked(nextHasLiked);
    setLikes(nextLikes);

    if (nextHasLiked) {
      setIsHeartAnimating(true);
      setTimeout(() => setIsHeartAnimating(false), 400);
    }

    setIsLiking(true);
    try {
      const res = await fetch(`/api/comments/${comment.id}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setHasLiked(data.hasLiked);
        setLikes(data.likeCount);
      } else {
        // Revert on failure
        setHasLiked(hasLiked);
        setLikes(likes);
      }
    } catch {
      setHasLiked(hasLiked);
      setLikes(likes);
    } finally {
      setIsLiking(false);
    }
  };

  // Submit reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setReplyError("Please log in to reply");
      return;
    }

    const trimmed = replyContent.trim();
    if (!trimmed) return;

    setIsSubmittingReply(true);
    setReplyError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekId,
          content: trimmed,
          parentId: comment.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setReplyError(data.error || "Failed to post reply");
        return;
      }

      onReplyAdded(comment.id, data.comment);
      setReplyContent("");
      setShowReplyBox(false);
      setShowRepliesThread(true);
    } catch {
      setReplyError("Network error posting reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Delete comment
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onCommentDeleted(comment.id, comment.parentId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const initials = comment.username.slice(0, 2).toUpperCase();
  const avatarGrad = getAvatarGradient(comment.username);

  return (
    <div className="flex flex-col group animate-fade-in-up">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full bg-gradient-to-tr ${avatarGrad} flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm`}
        >
          {initials}
        </div>

        {/* Comment Body & Meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-foreground hover:underline cursor-pointer">
              @{comment.username}
            </span>

            {comment.favoriteTeam && (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface border border-border/70 hover:border-accent/50 transition-colors shadow-xs shrink-0"
                title={`Fan of ${comment.favoriteTeam.name}`}
              >
                <TeamLogo
                  logoUrl={comment.favoriteTeam.logoUrl}
                  name={comment.favoriteTeam.name}
                  shortName={comment.favoriteTeam.shortName}
                  primaryColor={comment.favoriteTeam.primaryColor}
                  size={14}
                />
                <span className="text-[10px] font-bold text-muted/90 leading-none">
                  {comment.favoriteTeam.shortName}
                </span>
              </span>
            )}

            {comment.userRole === "ADMIN" && (
              <span className="px-1 py-0.2 rounded bg-accent/20 border border-accent/40 text-[9px] font-bold text-accent uppercase tracking-wider">
                Admin
              </span>
            )}
            <span className="text-[11px] text-muted/70">
              · {formatRelativeTime(comment.createdAt)}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-foreground/90 mt-1 leading-relaxed break-words">
            {renderFormattedContent(comment.content)}
          </p>

          {/* Action Row */}
          <div className="flex items-center gap-4 mt-2 text-[11px] font-semibold text-muted">
            <button
              type="button"
              onClick={() => {
                setShowReplyBox(!showReplyBox);
                if (!showReplyBox && !replyContent) {
                  setReplyContent(`@${comment.username} `);
                }
              }}
              className="hover:text-foreground transition-colors active:scale-95"
            >
              Reply
            </button>

            {(isAuthor || isAdmin) && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="hover:text-danger text-muted/60 hover:text-danger/90 transition-colors active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        </div>

        {/* Right: Heart Like Button & Count (Instagram/TikTok style) */}
        <div className="flex flex-col items-center justify-center shrink-0 ml-1">
          <button
            type="button"
            onClick={handleLikeToggle}
            className={`p-1.5 rounded-full transition-transform active:scale-75 ${
              isHeartAnimating ? "scale-125" : "scale-100"
            }`}
            title={hasLiked ? "Unlike" : "Like"}
          >
            <svg
              className={`w-4 h-4 transition-colors duration-200 ${
                hasLiked
                  ? "fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                  : "fill-transparent text-muted/70 hover:text-foreground"
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={hasLiked ? "0" : "2"}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
          {likes > 0 && (
            <span
              className={`text-[10px] font-bold tabular-nums -mt-1 ${
                hasLiked ? "text-rose-500" : "text-muted"
              }`}
            >
              {likes}
            </span>
          )}
        </div>
      </div>

      {/* Inline Reply Composer */}
      {showReplyBox && (
        <form
          onSubmit={handleSendReply}
          className="mt-3 ml-11 pl-2 border-l-2 border-accent/40 flex flex-col gap-2 animate-fade-in-up"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Reply to @${comment.username}...`}
              maxLength={500}
              className="flex-1 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-foreground text-xs placeholder:text-muted/60 focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={!replyContent.trim() || isSubmittingReply}
              className="px-3 py-1.5 rounded-lg bg-accent text-background font-bold text-xs hover:bg-accent-glow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmittingReply ? "..." : "Reply"}
            </button>
            <button
              type="button"
              onClick={() => setShowReplyBox(false)}
              className="p-1.5 text-muted hover:text-foreground text-xs"
            >
              ✕
            </button>
          </div>
          {replyError && (
            <p className="text-[11px] text-danger font-medium">{replyError}</p>
          )}
        </form>
      )}

      {/* TikTok / Instagram Collapsible Replies Thread */}
      {hasReplies && (
        <div className="ml-11 mt-2">
          <button
            type="button"
            onClick={() => setShowRepliesThread(!showRepliesThread)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground transition-colors group/replies"
          >
            <span className="w-6 h-px bg-border group-hover/replies:bg-accent transition-colors" />
            <span>
              {showRepliesThread
                ? "Hide replies"
                : `View ${replies.length} ${
                    replies.length === 1 ? "reply" : "replies"
                  }`}
            </span>
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${
                showRepliesThread ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Nested Replies List */}
          {showRepliesThread && (
            <div className="mt-3 pl-3 border-l border-border/60 space-y-4 animate-fade-in-up">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  weekId={weekId}
                  onReplyAdded={onReplyAdded}
                  onCommentDeleted={onCommentDeleted}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
