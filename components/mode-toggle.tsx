"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { PiMoon, PiSun } from "react-icons/pi";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <PiSun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <PiMoon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}
