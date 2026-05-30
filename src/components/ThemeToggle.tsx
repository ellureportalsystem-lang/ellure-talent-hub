import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";
import {
  applyPortalTheme,
  getStoredPortalTheme,
  isDashboardPath,
  setStoredPortalTheme,
  type PortalTheme,
} from "@/lib/portalTheme";

export function ThemeToggle({
  variant = "icon",
  usePortalTheme: usePortalThemeProp,
}: {
  variant?: "icon" | "sidebar";
  usePortalTheme?: boolean;
}) {
  const { pathname } = useLocation();
  const portalMode = usePortalThemeProp ?? isDashboardPath(pathname);
  const { theme, setTheme } = useTheme();
  const [portalTheme, setPortalThemeState] = useState<PortalTheme>(() =>
    typeof window !== "undefined" ? getStoredPortalTheme() : "light"
  );

  useEffect(() => {
    if (portalMode) {
      setPortalThemeState(getStoredPortalTheme());
    }
  }, [portalMode, pathname]);

  const togglePortalTheme = () => {
    const next: PortalTheme = portalTheme === "dark" ? "light" : "dark";
    setStoredPortalTheme(next);
    applyPortalTheme(next);
    setPortalThemeState(next);
  };

  if (portalMode) {
    if (variant === "sidebar") {
      return (
        <button
          type="button"
          onClick={togglePortalTheme}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {portalTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span>{portalTheme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
      );
    }

    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 touch-target" onClick={togglePortalTheme}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle portal theme</span>
      </Button>
    );
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
