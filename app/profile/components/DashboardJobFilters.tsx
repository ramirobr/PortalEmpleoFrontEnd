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
  { label: "Tiempo Completo", icon: <Clock className="w-4 h-4" />, query: "tiempo-completo" },
  { label: "Medio Tiempo", icon: <Heart className="w-4 h-4" />, query: "medio-tiempo" },
  { label: "Teletrabajo", icon: <Monitor className="w-4 h-4" />, query: "teletrabajo" },
  { label: "Pasantías", icon: <GraduationCap className="w-4 h-4" />, query: "pasantia" },
];

export default function DashboardJobFilters() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3 flex-wrap py-4">
      {FILTERS.map((f) => (
        <Link
          key={f.label}
          href={`/empleos-busqueda?modality=${f.query}`}
          onClick={() => setActive(f.label)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
            active === f.label
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
          }`}
        >
          {f.icon}
          {f.label}
        </Link>
      ))}

      <Link
        href="/empleos-busqueda"
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-primary hover:text-secondary transition-colors"
      >
        Ver más
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
