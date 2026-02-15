import { Idioma } from "@/types/user";
import { Languages } from "lucide-react";

interface LanguagesSectionProps {
  idiomas: Idioma[];
}

export default function LanguagesSection({ idiomas }: LanguagesSectionProps) {
  if (!idiomas || idiomas.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Languages className="text-teal-600" size={24} />
        <h2 className="text-xl font-bold text-teal-600">Idiomas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {idiomas.map((lang, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-gray-50 flex items-center justify-between border border-gray-100"
          >
            <div>
              <h4 className="font-bold text-gray-900">{lang.nombre}</h4>
              <p className="text-xs font-bold text-teal-600 uppercase">
                {lang.nivel}
              </p>
            </div>
            {/* Visual representation of level could be added here */}
          </div>
        ))}
      </div>
    </div>
  );
}
