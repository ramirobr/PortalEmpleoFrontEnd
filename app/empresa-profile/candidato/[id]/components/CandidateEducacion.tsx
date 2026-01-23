"use client";

import { Educacion } from "@/types/user";

interface CandidateEducacionProps {
  educaciones: Educacion[];
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Actualidad";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-EC", {
    month: "short",
    year: "numeric",
  });
}

export default function CandidateEducacion({
  educaciones,
}: CandidateEducacionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
          />
        </svg>
        Educación
        <span className="ml-auto text-sm font-normal text-gray-500">
          {educaciones.length} registros
        </span>
      </h3>

      <div className="space-y-6">
        {educaciones.map((edu, index) => (
          <div
            key={edu.id}
            className={`relative pl-6 ${
              index !== educaciones.length - 1
                ? "pb-6 border-l-2 border-gray-200"
                : ""
            }`}
          >
            {/* Timeline dot */}
            <div
              className={`absolute left-0 top-0 w-3 h-3 rounded-full -translate-x-[7px] ${
                edu.estaCursando
                  ? "bg-primary ring-4 ring-primary/20"
                  : "bg-gray-300"
              }`}
            />

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h4 className="font-semibold text-gray-900">{edu.titulo}</h4>
                <p className="text-sm text-gray-600">{edu.institucion}</p>
                {edu.periodo && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                    {edu.periodo}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 whitespace-nowrap">
                {formatDate(edu.fechaInicio)} - {formatDate(edu.fechaFin)}
                {edu.estaCursando && (
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                    En curso
                  </span>
                )}
              </div>
            </div>

            {edu.descripcion && (
              <p className="text-sm text-gray-600 mt-2">{edu.descripcion}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
