import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

type NavItem = {
  name: string;
  link: string;
  icon?: ReactNode;
};

type FloatingNavProps = {
  navItems: NavItem[];
  className?: string;
};

export const FloatingNav = ({ navItems, className }: FloatingNavProps) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const getLinkClasses = (link: string) => {
    const isActive = location.pathname === link;
    const isPrimaryCta = link === "/chat";

    return cn(
      "group relative flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all duration-200",
      isPrimaryCta
        ? "border-white/14 bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:border-white/18 hover:bg-white/14 hover:text-white"
        : "border-transparent",
      isActive
        ? isPrimaryCta
          ? "border-white/20 bg-white/14 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
          : "border-white/14 bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_10px_30px_rgba(0,0,0,0.22)]"
        : isPrimaryCta
          ? ""
          : "text-zinc-300 hover:border-white/10 hover:bg-white/6 hover:text-white"
    );
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-5 z-5000 flex items-center justify-center px-4 transition-[transform,opacity] duration-300 sm:px-6 lg:px-8 font-[Sora,Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,sans-serif]",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0",
        className
      )}
    >
      <div className="absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center sm:left-6 lg:left-8">
        <Link
          to="/"
          className="px-1 py-2 text-sm font-semibold tracking-[0.05rem] text-white/95 transition-colors hover:text-white"
        >
          <span>Advista</span>
        </Link>
      </div>

      <div className="relative flex min-w-0 justify-center px-20 sm:px-24 lg:px-32">
        <div className="relative flex min-w-0 items-center gap-1 overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl supports-backdrop-filter:bg-black/35">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_42%),linear-gradient(90deg,rgba(139,92,246,0.12),rgba(59,130,246,0.08),rgba(139,92,246,0.12))] opacity-60" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-white/35 to-transparent" />

          <div className="relative flex min-w-0 items-center gap-1 rounded-full border border-white/8 bg-black/20 p-1">
            {navItems.map((navItem) => (
              <Link key={navItem.link} to={navItem.link} className={getLinkClasses(navItem.link)}>
                <span className="flex h-4 w-4 items-center justify-center sm:hidden">
                  {navItem.icon ?? <span className="text-[11px] font-semibold">{navItem.name.slice(0, 1)}</span>}
                </span>
                <span className="hidden sm:block">{navItem.name}</span>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
