"use client";

import { Habilidades } from "@/types/user";
import Pill from "@/components/shared/components/Pill";

interface CandidateHabilidadesProps {
  habilidades: Habilidades[];
}

function getNivelColor(nivel: string): {
  bgColor: string;
  textColor: string;
} {
  switch (nivel.toLowerCase()) {
    case "avanzado":
      return { bgColor: "bg-green-100", textColor: "text-green-700" };
    case "intermedio":
      return { bgColor: "bg-blue-100", textColor: "text-blue-700" };
    case "básico":
    default:
      return { bgColor: "bg-gray-100", textColor: "text-gray-700" };
  }
}

export default function CandidateHabilidades({
  habilidades,
}: CandidateHabilidadesProps) {
  // Group skills by category
  const skillsByCategory = habilidades.reduce(
    (acc, skill) => {
      if (!acc[skill.categoria]) {
        acc[skill.categoria] = [];
      }
      acc[skill.categoria].push(skill);
      return acc;
    },
    {} as Record<string, Habilidades[]>,
  );

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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        Habilidades
        <span className="ml-auto text-sm font-normal text-gray-500">
          {habilidades.length} habilidades
        </span>
      </h3>

      <div className="space-y-4">
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <div key={category}>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const { bgColor, textColor } = getNivelColor(skill.nivel);
                return (
                  <Pill
                    key={skill.id}
                    variant="custom"
                    bgColor={bgColor}
                    textColor={textColor}
                    className="flex items-center gap-1"
                  >
                    {skill.nombre}
                  </Pill>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Skill Level Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-2">Nivel de habilidad:</p>
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Avanzado
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Intermedio
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            Básico
          </span>
        </div>
      </div>
    </div>
  );
}
