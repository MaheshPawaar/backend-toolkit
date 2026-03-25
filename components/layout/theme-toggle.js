"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useSyncExternalStore } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Cycle: dark → light → system → dark
  const cycle = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  const icon = !mounted ? (
    <Moon className="h-4 w-4" />
  ) : theme === "light" ? (
    <Sun className="h-4 w-4" />
  ) : theme === "system" ? (
    <Monitor className="h-4 w-4" />
  ) : (
    <Moon className="h-4 w-4" />
  );

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      className="h-8 w-8"
    >
      {icon}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
