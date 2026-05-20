import { PremiumButton } from "@/components/shared/components/PremiumButton";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  FileText,
  Users,
  Briefcase,
  Award,
} from "lucide-react";
import { CompanyProfileData } from "@/types/company";
import { AplicanteReciente } from "@/types/company";

interface EmpresaSidebarWidgetsProps {
  companyProfile: CompanyProfileData | null;
  aplicantesRecientes: AplicanteReciente[];
  ofertasCount: number;
  contrataciones: number;
  candidatosEnRevision: number;
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
        <span className="text-lg font-bold text-slate-800 leading-none">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

export default function EmpresaSidebarWidgets({
  companyProfile,
  aplicantesRecientes,
  ofertasCount,
  contrataciones,
  candidatosEnRevision,
}: EmpresaSidebarWidgetsProps) {
  const profilePct = calcularPorcentajePerfil(companyProfile);

  const entrevistas = aplicantesRecientes.filter((a) =>
    a.usuario.estadoAplicacion.nombre.toLowerCase().includes("entrevista"),
  ).length;

  const procesos = [
    {
      label: "En revisión",
      count: candidatosEnRevision,
      href: "/empresa-perfil/postulaciones",
      icon: Users,
    },
    {
      label: "Entrevistas",
      count: entrevistas,
      href: "/empresa-perfil/postulaciones",
      icon: Briefcase,
    },
    {
      label: "Ofertas Activas",
      count: ofertasCount,
      href: "/empresa-perfil/empleos",
      icon: FileText,
    },
    {
      label: "Contratados",
      count: contrataciones,
      href: "/empresa-perfil/postulaciones",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Mi Empresa - Profile completion */}
      <section
        className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6"
        aria-labelledby="perfil-empresa-title"
      >
        <h3
          id="perfil-empresa-title"
          className="text-sm font-semibold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wider"
        >
          <Building2 className="size-4 text-primary" />
          Mi Empresa
        </h3>
        <div className="flex flex-col items-center gap-4">
          <CircularProgress percentage={profilePct} />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900">
              Perfil {profilePct}% completo
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {profilePct < 100
                ? "Completa tu perfil para atraer mejor talento."
                : "¡Tu perfil está excelente!"}
            </p>
          </div>
          <PremiumButton
            href="/empresa-perfil/perfil"
            variant="primary"
            className="w-full"
          >
            Editar Perfil
          </PremiumButton>
        </div>
      </section>

      {/* Tus procesos activos - with counts */}
      <section
        className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6"
        aria-labelledby="procesos-activos-title"
      >
        <h3
          id="procesos-activos-title"
          className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wider"
        >
          <FileText className="size-4 text-primary" />
          Procesos Activos
        </h3>
        <ul className="space-y-1">
          {procesos.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center justify-between py-3  rounded-xl text-sm text-slate-700 hover:bg-zinc-50 hover:text-primary transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-zinc-50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <item.icon className="size-4 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 bg-zinc-100 px-2 py-0.5 rounded text-[12px] group-hover:bg-primary group-hover:text-white transition-colors">
                    {item.count}
                  </span>
                  <ChevronRight className="size-4 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Tips Section */}
      <section
        className="bg-gradient-to-br from-primary to-primary-deep rounded-2xl shadow-lg p-6 text-white"
        aria-labelledby="tips-title"
      >
        <h3
          id="tips-title"
          className="text-sm font-semibold mb-4 flex items-center gap-2 uppercase tracking-wider"
        >
          <Award className="size-4 text-white/80" />
          Mejora tus procesos
        </h3>
        <ul className="space-y-4">
          {[
            "Crea ofertas de empleo efectivas",
            "Optimiza tus entrevistas",
            "Atrae al mejor talento",
          ].map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-3 text-xs font-semibold leading-relaxed"
            >
              <div className="size-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-3 text-white" />
              </div>
              <span className="pt-0.5">{tip}</span>
            </li>
          ))}
        </ul>
        <PremiumButton
          href="/blog"
          variant="white"
          size="sm"
          className="mt-6 w-full"
        >
          Ver Consejos →
        </PremiumButton>
      </section>
    </div>
  );
}
