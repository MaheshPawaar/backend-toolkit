"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES } from "@/data/tool-registry";

export function ToolLayout({ name, description, category, children }) {
  const cat = CATEGORIES.find((c) => c.id === category);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 mb-3 -ml-2 h-7 px-2.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          All Tools
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
          {cat && (
            <Badge variant="secondary" className="text-xs">
              {cat.label}
            </Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Separator className="mb-6" />
      {children}
    </div>
  );
}
