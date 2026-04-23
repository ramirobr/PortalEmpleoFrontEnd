import Link from "next/link";
import { Building2, CheckCircle2, ChevronRight, FileText, Users, Briefcase, Award } from "lucide-react";
import { CompanyProfileData } from "@/types/company";
import { AplicanteReciente } from "@/types/company";

interface EmpresaSidebarWidgetsProps {
  companyProfile: CompanyProfileData | null;
  aplicantesRecientes: AplicanteReciente[];
  ofertasCount: number;
  postulacionesCount: number;
}

function calcularPorcentajePerfil(profile: CompanyProfileData | null): number {
  if (!profile) return 0;
  const campos = [
    profile.descripcion,
    profile.sitioWeb,
    profile.logoUrl,
    profile.telefonoContacto,
    profile.correoContacto,
    profile.direccion,
    profile.ciudad?.nombre,
    profile.industria?.nombre,
    profile.cantidadEmpleados?.nombre,
    profile.razonSocial,
  ];
  const rellenos = campos.filter((c) => !!c && c.trim() !== "").length;
  return Math.round((rellenos / campos.length) * 100);
}

function CircularProgress({ percentage }: { percentage: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#006a62"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <Building2 className="size-5 text-primary mb-0.5" />
        <span className="text-lg font-black text-gray-800 leading-none">{percentage}%</span>
      </div>
    </div>
  );
}

export default function EmpresaSidebarWidgets({
  companyProfile,
  aplicantesRecientes,
  ofertasCount,
  postulacionesCount,
}: EmpresaSidebarWidgetsProps) {
  const profilePct = calcularPorcentajePerfil(companyProfile);

  // Count applicants by status
  const enRevision = aplicantesRecientes.filter((a) =>
    a.usuario.estadoAplicacion.nombre.toLowerCase().includes("nuevo") ||
    a.usuario.estadoAplicacion.nombre.toLowerCase().includes("revision") ||
    a.usuario.estadoAplicacion.nombre.toLowerCase().includes("revisión")
  ).length;

  const entrevistas = aplicantesRecientes.filter((a) =>
    a.usuario.estadoAplicacion.nombre.toLowerCase().includes("entrevista")
  ).length;

  const procesos = [
    { label: "En revisión", count: enRevision, href: "/empresa-profile/postulaciones" },
    { label: "Entrevistas", count: entrevistas, href: "/empresa-profile/postulaciones" },
    { label: "Ofertas", count: ofertasCount, href: "/empresa-profile/empleos" },
    { label: "Contratados", count: postulacionesCount, href: "/empresa-profile/postulaciones" },
  ];

  return (
    <div className="space-y-4">
      {/* Mi Empresa - Profile completion */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Building2 className="size-4 text-primary" />
          Mi Empresa
        </h3>
        <div className="flex flex-col items-center gap-3">
          <CircularProgress percentage={profilePct} />
          <p className="text-xs text-gray-500 text-center">
            Perfil {profilePct >= 80 ? "casi completo" : profilePct >= 50 ? "en progreso" : "incompleto"}
          </p>
          <Link
            href="/empresa-profile/perfil"
            className="w-full flex items-center justify-center py-2.5 bg-secondary-container hover:bg-secondary text-white font-bold text-xs uppercase rounded-lg transition-colors"
          >
            Completar perfil
          </Link>
        </div>
      </div>

      {/* Mejora tus contrataciones */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Award className="size-4 text-primary" />
          Mejora tus contrataciones
        </h3>
        <ul className="space-y-2.5">
          {[
            "Crea ofertas de empleo efectivas",
            "Optimiza tus entrevistas",
            "Consejos para atraer talento",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Tus procesos activos - quick links */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          Tus procesos activos
        </h3>
        <ul className="space-y-2">
          {[
            { label: "En revisión", href: "/empresa-profile/postulaciones" },
            { label: "Entrevistas", href: "/empresa-profile/postulaciones" },
            { label: "Ofertas", href: "/empresa-profile/empleos" },
            { label: "Contratados", href: "/empresa-profile/postulaciones" },
          ].map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
              >
                <ChevronRight className="size-3.5 text-primary" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tus procesos activos - with counts */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          Tus procesos activos
        </h3>
        <ul className="divide-y divide-gray-50">
          {procesos.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center justify-between py-2.5 text-sm text-gray-700 hover:text-primary transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <FileText className="size-3.5 text-gray-400 group-hover:text-primary transition-colors" />
                  {item.label}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{item.count}</span>
                  <ChevronRight className="size-3.5 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
