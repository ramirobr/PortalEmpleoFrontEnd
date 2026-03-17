import { CompanyProfileData } from "@/types/company";
import { Building2, Globe, Users, Briefcase, CheckCircle } from "lucide-react";

interface CompanyProfileCardProps {
  profile: CompanyProfileData;
}

export default function CompanyProfileCard({
  profile,
}: CompanyProfileCardProps) {
  return (
    <div className="bg-white border-primary shadow hover:shadow-lg relative border-l-8 border-l-primary rounded-xl transition-all overflow-hidden">
      <div className="p-8 border-b border-gray-50">
        <div className="flex items-center gap-6">
          {profile.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt={`Logo de ${profile.nombre}`}
              className="w-24 h-24 rounded-2xl object-cover shadow-sm border border-gray-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Building2 className="w-12 h-12 text-primary" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-extrabold text-primary tracking-tight">{profile.nombre}</h2>
              {profile.estado && (
                <span
                  className={`text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full ${
                    profile.estado.nombre === "Activo"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {profile.estado.nombre}
                </span>
              )}
            </div>
            <p className="text-lg font-medium text-gray-500">{profile.razonSocial}</p>
          </div>
        </div>
      </div>
      <div className="p-8">
        {profile.descripcion && (
          <div className="mb-8">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3 ml-1">Acerca de la empresa</h3>
            <p className="text-gray-700 leading-relaxed text-base bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
              {profile.descripcion}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Briefcase, label: "Industria", value: profile.industria?.nombre ?? "No especificada" },
            { icon: Users, label: "Tamaño de la empresa", value: profile.cantidadEmpleados?.nombre ?? "No especificado" },
            { icon: CheckCircle, label: "Condición Fiscal", value: profile.condicionFiscal?.nombre ?? "No especificada" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">{item.label}</p>
                <p className="font-bold text-gray-900">{item.value}</p>
              </div>
            </div>
          ))}

          {profile.sitioWeb && (
            <div className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">Sitio Web</p>
                <a
                  href={profile.sitioWeb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-primary hover:text-secondary transition-colors truncate block max-w-[200px]"
                >
                  {profile.sitioWeb.replace(/^https?:\/\//, "")}
                </a>
              </div>
            </div>
          )}
        </div>

        {profile.fechaRegistro && (
          <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-400 font-medium">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             Empresa registrada el{" "}
            {new Date(profile.fechaRegistro).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        )}
      </div>
    </div>
  );
}
