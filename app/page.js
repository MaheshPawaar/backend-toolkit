"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Shield, Terminal, Github, Star, Heart, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CommandMenu } from "@/components/shared/command-menu";
import { TOOLS, CATEGORIES } from "@/data/tool-registry";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const readyTools = TOOLS.filter((t) => t.ready);
  const filtered =
    activeCategory === "all"
      ? readyTools
      : readyTools.filter((t) => t.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Grid background */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(24 95% 53% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(24 95% 53% / 0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Top ambient glow */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,hsl(24_95%_53%/0.08)_0%,transparent_70%)] z-0 pointer-events-none dark:bg-[radial-gradient(ellipse,hsl(24_95%_53%/0.06)_0%,transparent_70%)]" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 font-mono text-sm font-bold text-white shadow-[0_0_16px_hsl(24_95%_53%/0.25)]">
              B
            </div>
            <span className="font-mono text-sm font-semibold tracking-tight">
              backend<span className="text-orange-500">kit</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCmdOpen(true)}
              className="hidden h-8 gap-2 px-3 text-xs text-muted-foreground sm:flex"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search tools</span>
              <kbd className="pointer-events-none ml-3 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                ⌘K
              </kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCmdOpen(true)}
              className="h-8 w-8 sm:hidden"
            >
              <Search className="h-4 w-4" />
            </Button>

            <ThemeToggle />

            <a
              href="https://github.com/MaheshPawaar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm hover:bg-muted transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className={`relative z-10 text-center px-4 pt-16 pb-5 sm:px-6 sm:pt-20 transition-all duration-600 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1 text-xs font-medium text-orange-500 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
          {readyTools.length} tools · 100% client-side · open source
        </div>

        <h1 className="mx-auto max-w-2xl font-mono text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
          Every tool a{" "}
          <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-clip-text text-transparent">
            backend dev
          </span>{" "}
          Googles daily
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
          JSON, JWT, Base64, cron, regex, hashing — all in one place.
          <br />
          No server. No tracking. Your data never leaves the browser.
        </p>

        {/* Trust badges */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground sm:gap-6">
          <span className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" /> Zero data collection
          </span>
          <span className="hidden text-border sm:block">·</span>
          <span className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5" /> Works offline
          </span>
          <span className="hidden text-border sm:block">·</span>
          <span className="flex items-center gap-1.5">
            <Github className="h-3.5 w-3.5" /> MIT License
          </span>
        </div>
      </section>

      {/* Category filter */}
      <div
        className={`relative z-10 flex flex-wrap items-center justify-center gap-1.5 px-4 pt-7 pb-2 sm:px-6 transition-opacity duration-500 delay-300 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? "border-orange-500/30 bg-orange-500/10 text-orange-500"
                  : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {cat.icon && <cat.icon className="h-3 w-3 opacity-70" />}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Tool grid */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 pb-20">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((tool, i) => {
            const Icon = tool.icon;
            const cat = CATEGORIES.find((c) => c.id === tool.category);
            return (
              <Link
                key={tool.name}
                href={tool.route}
                className={`group transition-all duration-300 ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${350 + i * 30}ms` }}
              >
                <Card className="h-full p-5 transition-all duration-200 hover:border-orange-500/20 hover:shadow-[0_8px_32px_hsl(24_95%_53%/0.06)] hover:-translate-y-0.5 dark:hover:shadow-[0_8px_32px_hsl(24_95%_53%/0.08)]">
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/50">
                      <Icon className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="flex gap-1.5">
                      {tool.hot && (
                        <Badge
                          variant="secondary"
                          className="border-orange-500/20 bg-orange-500/10 text-orange-500 text-[10px] uppercase tracking-wide px-2 py-0"
                        >
                          Popular
                        </Badge>
                      )}
                      {tool.isNew && (
                        <Badge
                          variant="secondary"
                          className="border-green-500/20 bg-green-500/10 text-green-500 text-[10px] uppercase tracking-wide px-2 py-0"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                  </div>

                  <h3 className="font-mono text-sm font-semibold tracking-tight">
                    {tool.name}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {tool.desc}
                  </p>

                  <div className="mt-3.5 flex items-center justify-between border-t pt-3">
                    <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
                      {cat?.label}
                    </span>
                    <span className="text-sm text-muted-foreground/40 transition-colors group-hover:text-orange-500">
                      →
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Support CTA */}
      <section className="relative z-10 mx-auto max-w-2xl px-4 pb-16 text-center sm:px-6">
        <div className="rounded-xl border bg-card p-8">
          <h2 className="text-lg font-semibold tracking-tight">
            Enjoying BackendKit?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            If any of these tools saved you time, consider starring the repo, sponsoring the project, or following along on X.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/MaheshPawaar/backendkit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Star className="h-4 w-4 text-orange-500" />
              Star on GitHub
            </a>
            <a
              href="https://github.com/sponsors/MaheshPawaar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Heart className="h-4 w-4 text-pink-500" />
              Sponsor
            </a>
            <a
              href="https://x.com/MaheshPawaar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Twitter className="h-4 w-4" />
              Follow on X
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 text-xs text-muted-foreground sm:px-6">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-foreground/60">
              backend<span className="text-orange-500">kit</span>
            </span>
            <span>· Built by Mahesh</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/MaheshPawaar"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="#"
              className="transition-colors hover:text-foreground"
            >
              @MaheshPawaar
            </a>
          </div>
        </div>
      </footer>

      {/* Command menu */}
      <CommandMenu open={cmdOpen} onOpenChange={setCmdOpen} />
    </div>
  );
}
