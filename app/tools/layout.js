"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CommandMenu } from "@/components/shared/command-menu";

export default function ToolsLayout({ children }) {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 font-mono text-sm font-bold text-white shadow-[0_0_16px_hsl(24_95%_53%/0.25)]">
                B
              </div>
              <span className="font-mono text-sm font-semibold tracking-tight">
                backend<span className="text-orange-500">kit</span>
              </span>
            </Link>
          </div>

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

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t">
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
