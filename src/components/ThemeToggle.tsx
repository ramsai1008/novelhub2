"use client";

import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@headlessui/react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const enabled = theme === "dark";

  return (
    <div className="flex items-center space-x-2">
      <Sun className="w-5 h-5 text-yellow-500" />
      <Switch
        checked={enabled}
        onChange={toggleTheme}
        className={`${enabled ? "bg-gray-800" : "bg-gray-300"}
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300`}
      >
        <span
          className={`${
            enabled ? "translate-x-6 bg-white" : "translate-x-1 bg-black"
          } inline-block h-4 w-4 transform rounded-full transition-transform`}
        />
      </Switch>
      <Moon className="w-5 h-5 text-gray-800 dark:text-white" />
    </div>
  );
}
