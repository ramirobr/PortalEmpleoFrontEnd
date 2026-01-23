"use client";

import { CandidateCertificacion } from "@/types/candidate";

interface CandidateCertificacionesProps {
  certificaciones: CandidateCertificacion[];
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Sin vencimiento";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isExpired(dateString: string | null): boolean {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
}

export default function CandidateCertificaciones({
  certificaciones,
}: CandidateCertificacionesProps) {
  if (certificaciones.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
        Certificaciones
        <span className="ml-auto text-sm font-normal text-gray-500">
          {certificaciones.length} certificaciones
        </span>
      </h3>

      <div className="space-y-4">
        {certificaciones.map((cert) => {
          const expired = isExpired(cert.fechaExpiracion);
          return (
            <div
              key={cert.id}
              className={`p-4 rounded-lg border ${
                expired
                  ? "border-red-200 bg-red-50"
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{cert.nombre}</h4>
                  <p className="text-sm text-gray-600">{cert.institucion}</p>
                </div>
                {expired && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded whitespace-nowrap">
                    Expirada
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Obtenido: {formatDate(cert.fechaObtencion)}
                </span>
                {cert.fechaExpiracion && (
                  <span
                    className={`flex items-center gap-1 ${
                      expired ? "text-red-600" : ""
                    }`}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Expira: {formatDate(cert.fechaExpiracion)}
                  </span>
                )}
              </div>

              {cert.credentialId && (
                <p className="mt-2 text-xs text-gray-400">
                  ID: {cert.credentialId}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
