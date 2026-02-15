import { Educacion } from "@/types/user";
import { GraduationCap } from "lucide-react";

interface EducationSectionProps {
  educacion: Educacion[];
}

export default function EducationSection({ educacion }: EducationSectionProps) {
  if (!educacion || educacion.length === 0) return null;

  const sortedEducation = [...educacion].sort((a, b) => {
    return (
      new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    );
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <GraduationCap className="text-teal-600" size={24} />
        <h2 className="text-xl font-bold text-teal-600">Educación</h2>
      </div>

      <div className="space-y-6">
        {sortedEducation.map((edu, index) => (
          <div key={index}>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 text-teal-600">
                <GraduationCap />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{edu.titulo}</h3>
                <p className="text-gray-600 text-sm">
                  {edu.institucion} • {new Date(edu.fechaInicio).getFullYear()}{" "}
                  -{" "}
                  {edu.fechaFin
                    ? new Date(edu.fechaFin).getFullYear()
                    : "Presente"}
                </p>
              </div>
            </div>
            {index < sortedEducation.length - 1 && (
              <div className="h-px bg-gray-100 w-full ml-16 mt-6"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
