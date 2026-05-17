import React from "react";
import { cn } from "@/lib/utils";

interface PremiumPageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PremiumPageHeader({ title, description, children, className }: PremiumPageHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4", className)}>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight leading-none mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-sm font-medium text-zinc-500 max-w-lg">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
