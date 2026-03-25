"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { TOOLS, CATEGORIES } from "@/data/tool-registry";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden" />
        }
      >
        <Menu className="h-4 w-4" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="px-4 pt-4 pb-2">
          <SheetTitle className="flex items-center gap-2 font-mono text-sm">
            <Image src="/logo.svg" alt="BackendKit" width={24} height={24} unoptimized />
            <span>backend<span className="text-orange-500">Kit</span></span>
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <div className="overflow-y-auto py-2">
          {CATEGORIES.filter((c) => c.id !== "all").map((category) => {
            const categoryTools = TOOLS.filter(
              (t) => t.category === category.id && t.ready
            );
            if (categoryTools.length === 0) return null;
            return (
              <div key={category.id} className="px-2 py-1">
                <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {category.label}
                </p>
                {categoryTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.route}
                      href={tool.route}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors"
                    >
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      {tool.name}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
