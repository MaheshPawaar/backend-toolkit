"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { TOOLS, CATEGORIES } from "@/data/tool-registry";

export function CommandMenu({ open, onOpenChange }) {
  const router = useRouter();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange?.((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpenChange]);

  const handleSelect = (route) => {
    onOpenChange?.(false);
    router.push(route);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Search tools..." />
        <CommandList>
          <CommandEmpty>No tools found.</CommandEmpty>
          {CATEGORIES.filter((c) => c.id !== "all").map((category) => {
            const categoryTools = TOOLS.filter(
              (t) => t.category === category.id
            );
            if (categoryTools.length === 0) return null;
            return (
              <CommandGroup key={category.id} heading={category.label}>
                {categoryTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <CommandItem
                      key={tool.route}
                      onSelect={() => handleSelect(tool.route)}
                      className="cursor-pointer"
                    >
                      <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">{tool.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {tool.desc}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
