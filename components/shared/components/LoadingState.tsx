import React from "react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  fullPage?: boolean;
}

export function LoadingState({ message = "Cargando…", className, fullPage = false }: LoadingStateProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="relative size-12 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-bold text-slate-900 uppercase tracking-widest animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-xl bg-zinc-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 bg-zinc-100 rounded" />
          <div className="h-3 w-1/2 bg-zinc-100 rounded" />
        </div>
      </div>
      <div className="space-y-2 pt-4">
        <div className="h-3 w-full bg-zinc-50 rounded" />
        <div className="h-3 w-5/6 bg-zinc-50 rounded" />
      </div>
    </div>
  );
}
