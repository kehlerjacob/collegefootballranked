"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Header } from "@/components/Header";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ login: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login(data.user);
      router.push("/ballot");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md glass-card rounded-lg p-6 sm:p-8 animate-fade-in-up">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome Back
            </h1>
            <p className="text-sm text-muted mt-1">
              Sign in to manage and submit your Top 25 ballot
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-danger/10 border border-danger/30 text-danger text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Email or Username
              </label>
              <input
                type="text"
                required
                value={formData.login}
                onChange={(e) =>
                  setFormData({ ...formData, login: e.target.value })
                }
                placeholder="gridiron_guru or name@example.com"
                className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-border text-foreground text-base sm:text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-md bg-surface border border-border text-foreground text-base sm:text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-md bg-accent text-background font-bold text-sm hover:bg-accent-glow transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-accent hover:underline font-semibold"
            >
              Sign up now
            </Link>
          </div>

          {/* Quick Demo Credentials Info */}
          <div className="mt-6 pt-4 border-t border-border/50 text-[11px] text-muted">
            <span className="font-semibold text-foreground/80">Demo Account:</span>{" "}
            <span className="font-mono text-accent">guru@cfr.com</span> /{" "}
            <span className="font-mono text-accent">password123</span>
          </div>
        </div>
      </main>
    </>
  );
}
