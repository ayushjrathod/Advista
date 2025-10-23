import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { Link } from "react-router-dom";
export function AuthShell({ title, description, children, footer, contentClassName, className }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-950 to-black px-4 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.24),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.2),transparent_65%)]" />
        <div className="absolute -inset-24 bg-[conic-gradient(from_45deg_at_50%_50%,rgba(255,255,255,0.12)_0deg,rgba(255,255,255,0)_120deg,rgba(255,255,255,0.12)_240deg,rgba(255,255,255,0)_360deg)] opacity-30 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[2px] rounded-[28px] bg-gradient-to-br from-primary/40 via-sky-500/10 to-purple-500/35 opacity-80 blur-xl"
        />
        <div aria-hidden className="pointer-events-none absolute inset-[18px] rounded-[22px] border border-white/10" />
        <Card
          className={cn(
            "relative overflow-hidden border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-900/70 ring-1 ring-primary/15 backdrop-blur-2xl",
            "before:absolute before:inset-x-10 before:-top-px before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent before:opacity-80 before:content-['']",
            className
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_55%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(236,72,153,0.14),transparent_60%)]"
          />
          <CardHeader className="relative z-10 space-y-2 text-center">
            <Link
              to="/"
              className="mx-auto inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:text-sky-300 transition-colors cursor-pointer"
            >
              Advista
            </Link>
            <CardTitle className="text-2xl font-semibold text-white sm:text-3xl">{title}</CardTitle>
            {description ? (
              <CardDescription className="text-base leading-relaxed text-slate-200">{description}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className={cn("relative z-10 space-y-6", contentClassName)}>{children}</CardContent>
          {footer ? (
            <CardFooter className="relative z-10 justify-center border-t border-border/60  py-5 text-sm text-slate-200">
              {footer}
            </CardFooter>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
