"use client";

import { ExperienciaLaboral } from "@/types/user";
import { BriefcaseIcon } from "@/components/shared/icons/Icons";
import { formatDate } from "@/lib/utils";
import { useHasMounted } from "@/lib/hooks";

interface AdminCandidateExperienciaProps {
  experiencias: ExperienciaLaboral[];
}

function calculateDuration(startDate: string, endDate: string | null): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths} mes${remainingMonths !== 1 ? "es" : ""}`;
  } else if (remainingMonths === 0) {
    return `${years} año${years !== 1 ? "s" : ""}`;
  } else {
    return `${years} año${years !== 1 ? "s" : ""} ${remainingMonths} mes${
      remainingMonths !== 1 ? "es" : ""
    }`;
  }
}

export default function AdminCandidateExperiencia({
  experiencias,
}: AdminCandidateExperienciaProps) {
  const hasMounted = useHasMounted();

  if (!experiencias.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BriefcaseIcon className="size-5 text-primary" />
          Experiencia Laboral
        </h3>
        <p className="text-sm text-slate-500">Sin experiencia laboral registrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <BriefcaseIcon className="size-5 text-primary" />
        Experiencia Laboral
        <span className="ml-auto text-sm font-normal text-slate-500">
          {experiencias.length} registros
        </span>
      </h3>

      <div className="space-y-6">
        {experiencias.map((exp, index) => (
          <div
            key={exp.id}
            className={`relative pl-6 ${
              index !== experiencias.length - 1 ? "pb-6 border-l-2 border-zinc-200" : ""
            }`}
          >
            {/* Timeline dot */}
            <div
              className={`absolute left-0 top-0 size-3 rounded-full -translate-x-[7px] ${
                exp.estaTrabajando ? "bg-primary ring-4 ring-primary/20" : "bg-zinc-300"
              }`}
            />

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h4 className="font-semibold text-slate-900">{exp.puesto}</h4>
                <p className="text-sm text-primary font-medium">{exp.empresa}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {exp.pais && (
                    <span className="inline-flex items-center text-xs text-slate-500">
                      <svg
                        className="size-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {exp.pais}
                    </span>
                  )}
                  {exp.sector && (
                    <span className="px-2 py-0.5 bg-zinc-100 text-slate-600 text-xs rounded">
                      {exp.sector}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm text-slate-500 whitespace-nowrap text-right">
                <div>
                  {formatDate(exp.fechaInicio)} -{" "}
                  {exp.estaTrabajando ? "Actualidad" : formatDate(exp.fechaFin)}
                </div>
                <div className="text-xs text-slate-400">
                  {hasMounted
                    ? calculateDuration(exp.fechaInicio, exp.estaTrabajando ? null : exp.fechaFin)
                    : "Cargando…"}
                </div>
                {exp.estaTrabajando && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                    Trabajo actual
                  </span>
                )}
              </div>
            </div>

            {exp.descripcion && (
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">{exp.descripcion}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
