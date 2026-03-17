import { UserInfoData } from "@/types/user";
import {
  CheckCircle2,
  FileText,
  Github,
  Globe,
  Linkedin,
  Zap,
} from "lucide-react";

interface ProfileSidebarProps {
  user: UserInfoData;
}

export default function ProfileSidebar({ user }: ProfileSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      {user.resumen && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4 text-teal-600 font-bold">
            <div className="p-1.5 bg-teal-50 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <h3>Resumen</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {user.resumen}
          </p>
        </div>
      )}

      {/* Skills */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4 text-teal-600 font-bold">
          <div className="p-1.5 bg-teal-50 rounded-lg">
            <Zap className="w-4 h-4" />
          </div>
          <h3>Habilidades principales</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Note: habiliades is a known typo in the backend response */}
          {user.habiliades?.map((skill) => (
            <span
              key={skill.id}
              className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg border border-teal-100"
            >
              {skill.nombre}
            </span>
          ))}
        </div>
      </div>

      {/* Social Links */}
      {(user.linkedin || user.github || user.website) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Redes Profesionales</h3>
          <div className="space-y-4">
            {user.linkedin && (
              <a
                href={user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-teal-600 transition-colors"
                aria-label={`LinkedIn de ${user.datosPersonales?.nombre}`}
              >
                <Linkedin size={18} />
                <span>
                  {user.linkedin.replace("https://www.linkedin.com/in/", "")}
                </span>
              </a>
            )}
            {user.github && (
              <a
                href={user.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-teal-600 transition-colors"
                aria-label={`GitHub de ${user.datosPersonales?.nombre}`}
              >
                <Github size={18} />
                <span>{user.github.replace("https://github.com/", "")}</span>
              </a>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-teal-600 transition-colors"
                aria-label={`Website de ${user.datosPersonales?.nombre}`}
              >
                <Globe size={18} />
                <span>{user.website}</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Status */}
      <div className="bg-teal-50/50 rounded-2xl border border-teal-100 p-6">
        <div className="flex items-center gap-2 mb-3 text-teal-600 font-bold">
          <CheckCircle2 size={20} className="fill-teal-100" />
          <h3>Estado de búsqueda</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {user.availabilityStatus || "En búsqueda activa"}
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
          ACTIVO AHORA
        </div>
      </div>
    </div>
  );
}
