import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { styles: string; label: string }> = {
  postulada: {
    styles: "bg-cyan-50 text-cyan-600 border-cyan-100",
    label: "Postulada",
  },
  entrevista: {
    styles: "bg-purple-50 text-purple-600 border-purple-100",
    label: "En Entrevista",
  },
  revision: {
    styles: "bg-blue-50 text-blue-600 border-blue-100",
    label: "En Revisión",
  },
  proceso: {
    styles: "bg-blue-50 text-blue-600 border-blue-100",
    label: "En Proceso",
  },
  contratado: {
    styles: "bg-green-50 text-green-600 border-green-100",
    label: "Contratado",
  },
  finalizado: {
    styles: "bg-green-50 text-green-600 border-green-100",
    label: "Finalizado",
  },
  rechazado: {
    styles: "bg-red-50 text-red-600 border-red-100",
    label: "Rechazado",
  },
  expirado: {
    styles: "bg-zinc-100 text-slate-600 border-zinc-200",
    label: "Expirado",
  },
  activa: {
    styles: "bg-teal-50 text-teal-600 border-teal-100",
    label: "Activa",
  },
  preseleccionado: {
    styles: "bg-zinc-100 text-slate-700 border-zinc-200",
    label: "Preseleccionado",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  
  // Find matching config or default
  const config = Object.entries(statusConfig).find(([key]) => 
    normalized.includes(key)
  )?.[1] || {
    styles: "bg-zinc-50 text-slate-600 border-zinc-100",
    label: status,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full border text-[12px] font-bold uppercase tracking-wider shadow-xs whitespace-nowrap",
        config.styles,
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current mr-1.5" aria-hidden="true" />
      {config.label}
    </span>
  );
}
