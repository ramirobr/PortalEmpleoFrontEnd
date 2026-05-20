"use client";

import { Loader2, LucideIcon } from "lucide-react";

interface AdminTableEmptyProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function AdminTableEmpty({
  icon: Icon,
  title,
  description,
}: AdminTableEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
      <Icon className="size-12 mb-3 text-slate-300" />
      <p className="text-lg font-medium">{title}</p>
      {description && <p className="text-sm">{description}</p>}
    </div>
  );
}

interface AdminTableLoadingProps {
  message?: string;
}

export function AdminTableLoading({
  message = "Cargando…",
}: AdminTableLoadingProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="size-8 animate-spin text-primary" />
      <span className="ml-2 text-slate-500">{message}</span>
    </div>
  );
}
