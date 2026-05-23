"use client";

import { useState } from "react";
import {
  Clock,
  Heart,
  Monitor,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const FILTERS = [
  {
    label: "Tiempo Completo",
    icon: <Clock className="size-4" />,
    query: "tiempo-completo",
  },
  {
    label: "Medio Tiempo",
    icon: <Heart className="size-4" />,
    query: "medio-tiempo",
  },
  {
    label: "Teletrabajo",
    icon: <Monitor className="size-4" />,
    query: "teletrabajo",
  },
  {
    label: "Pasantías",
    icon: <GraduationCap className="size-4" />,
    query: "pasantia",
  },
];

export default function DashboardJobFilters() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <ul
      className="flex items-center gap-3 flex-wrap py-4 mt-4"
      aria-label="Filtros rápidos de empleo"
    >
      {FILTERS.map((f) => (
        <li key={f.label}>
          <Link
            href={`/empleos-busqueda?modality=${f.query}`}
            onClick={() => setActive(f.label)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              active === f.label
                ? "bg-primary text-white border-primary"
                : "bg-white text-slate-700 border-zinc-200 hover:border-primary hover:text-primary"
            }`}
            aria-label={`Filtrar por ${f.label}`}
          >
            <span aria-hidden="true">{f.icon}</span>
            {f.label}
          </Link>
        </li>
      ))}

      <li>
        <Link
          href="/empleos-busqueda"
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-primary hover:text-secondary transition-colors outline-none focus-visible:underline"
          aria-label="Ver todas las opciones de búsqueda"
        >
          Ver más
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </li>
    </ul>
  );
}
