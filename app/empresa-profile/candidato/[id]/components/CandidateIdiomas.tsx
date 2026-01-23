"use client";

import { CandidateIdioma } from "@/types/candidate";

interface CandidateIdiomasProps {
  idiomas: CandidateIdioma[];
}

function getNivelPercentage(nivel: string): number {
  const nivelLower = nivel.toLowerCase();
  if (nivelLower.includes("nativo") || nivelLower.includes("c2")) return 100;
  if (nivelLower.includes("avanzado") || nivelLower.includes("c1")) return 85;
  if (nivelLower.includes("b2")) return 70;
  if (nivelLower.includes("b1") || nivelLower.includes("intermedio")) return 55;
  if (nivelLower.includes("a2")) return 40;
  if (nivelLower.includes("a1") || nivelLower.includes("básico")) return 25;
  return 50;
}

export default function CandidateIdiomas({ idiomas }: CandidateIdiomasProps) {
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
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        Idiomas
      </h3>

      <div className="space-y-4">
        {idiomas.map((idioma) => {
          const percentage = getNivelPercentage(idioma.nivel);
          return (
            <div key={idioma.id}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {idioma.nombre}
                </span>
                <span className="text-xs text-gray-500">{idioma.nivel}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
