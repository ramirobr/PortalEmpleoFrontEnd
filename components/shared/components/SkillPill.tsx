import React from "react";
import { cn } from "@/lib/utils";

interface SkillPillProps {
  skill: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}

export function SkillPill({ skill, className, variant = "outline" }: SkillPillProps) {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    outline: "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-primary/30 hover:bg-white transition-all",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-lg border text-[12px] font-semibold tracking-tight shadow-xs",
        variants[variant],
        className
      )}
    >
      {skill}
    </span>
  );
}
