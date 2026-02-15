import { ExperienciaLaboral } from "@/types/user";
import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExperienceSectionProps {
  experiencia: ExperienciaLaboral[];
}

export default function ExperienceSection({
  experiencia,
}: ExperienceSectionProps) {
  if (!experiencia || experiencia.length === 0) return null;

  const sortedExperience = [...experiencia].sort((a, b) => {
    return (
      new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    );
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <Briefcase className="text-teal-600" size={24} />
        <h2 className="text-xl font-bold text-teal-600">Experiencia Laboral</h2>
      </div>

      <div className="relative space-y-12">
        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-200"></div>
        {sortedExperience.map((exp, index) => (
          <div key={index} className="relative pl-10">
            <div
              className={cn(
                "absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white shadow-sm",
                index === 0 ? "bg-teal-500" : "bg-gray-300",
              )}
            ></div>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {exp.puesto}
                </h3>
                <p className="font-medium text-teal-600">{exp.empresa}</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
                {new Date(exp.fechaInicio).getFullYear()} -{" "}
                {exp.fechaFin
                  ? new Date(exp.fechaFin).getFullYear()
                  : "Presente"}
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {exp.descripcion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
