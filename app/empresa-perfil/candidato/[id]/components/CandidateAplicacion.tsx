"use client";

import { formatDate } from "@/lib/utils";
import { type CandidateAplicacion as CandidateAplicacionType } from "@/types/candidate";

interface CandidateAplicacionProps {
  aplicacion: CandidateAplicacionType;
}

function getStatusColor(estado: string): {
  bgColor: string;
  textColor: string;
} {
  switch (estado.toLowerCase()) {
    case "aprobado":
    case "aceptado":
      return { bgColor: "bg-green-100", textColor: "text-green-700" };
    case "rechazado":
      return { bgColor: "bg-red-100", textColor: "text-red-700" };
    case "en revisión":
    case "pendiente":
      return { bgColor: "bg-yellow-100", textColor: "text-yellow-700" };
    default:
      return { bgColor: "bg-zinc-100", textColor: "text-slate-700" };
  }
}

export default function CandidateAplicacion({
  aplicacion,
}: CandidateAplicacionProps) {
  const { bgColor, textColor } = getStatusColor(aplicacion.estado);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <svg
          className="size-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        Detalles de Aplicación
      </h3>

      <div className="space-y-4">
        {/* Status */}
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
            Estado
          </p>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
            {aplicacion.estado}
          </span>
        </div>

        {/* Position Applied */}
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
            Vacante
          </p>
          <p className="text-sm font-medium text-slate-900">
            {aplicacion.tituloVacante}
          </p>
        </div>

        {/* Application Date */}
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
            Fecha de Aplicación
          </p>
          <p className="text-sm text-slate-900">
            {formatDate(aplicacion.fechaAplicacion)}
          </p>
        </div>

        {/* Cover Letter */}
        {aplicacion.cartaPresentacion && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
              Carta de Presentación
            </p>
            <p className="text-sm text-slate-600 leading-relaxed bg-zinc-50 p-3 rounded-lg">
              {aplicacion.cartaPresentacion}
            </p>
          </div>
        )}

        {/* CV Download */}
        {aplicacion.curriculumUrl && (
          <div className="pt-2">
            <a
              href={aplicacion.curriculumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Descargar CV
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
