"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Pill from "@/components/shared/components/Pill";
import {
  CompanyProfileData,
  CompanyProfileFiltersResponse,
} from "@/types/company";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  Globe,
  Mail,
  MapPin,
  Phone,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useAuthStore } from "@/context/authStore";
import MapPicker from "@/components/ui/map-picker";
import { AdminInfoForm } from "./AdminInfoForm";
import { ContactInfoForm } from "./ContactInfoForm";
import { GeneralInfoForm } from "./GeneralInfoForm";
import { LogoUploadDialog } from "./LogoUploadDialog";

interface CompanyProfileViewProps {
  profile: CompanyProfileData;
  filters: CompanyProfileFiltersResponse | null;
}

export default function CompanyProfileView({
  profile,
  filters,
}: CompanyProfileViewProps) {
  const { data: session } = useSession();
  const [companyData, setCompanyData] = useState(profile);
  const companyLogo = useAuthStore((s) => s.companyLogo);

  const handleUpdateCompanyData = (
    updatedData: Partial<CompanyProfileData>,
  ) => {
    setCompanyData((prev) => ({ ...prev, ...updatedData }));
  };

  const locationParts = [
    companyData.ciudad?.nombre,
    companyData.provincia?.nombre,
    companyData.pais?.nombre,
  ].filter(Boolean);

  const admin = companyData.usuarioAdministrador;

  return (
    <div className="space-y-6">
      {/* Hero Card — Logo + Name + Status */}
      <Card className="overflow-hidden border-none shadow-soft">
        <div className="p-8 border-b border-surface-container-low">
          <div className="flex items-center gap-6">
            <LogoUploadDialog
              companyId={companyData.idEmpresa}
              companyName={companyData.nombre}
              accessToken={session?.user.accessToken}
            />

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-1">
                <h2 className="text-2xl font-display font-semibold text-foreground tracking-tight truncate">
                  {companyData.nombre}
                </h2>
                {companyData.estado && (
                  <Pill
                    variant={
                      companyData.estado.nombre === "Activo" ? "green" : "yellow"
                    }
                    className="uppercase text-[9px] font-semibold tracking-[0.15em] px-3 py-1 rounded-full shrink-0"
                    noButton
                  >
                    {companyData.estado.nombre}
                  </Pill>
                )}
              </div>
              <p className="text-sm font-medium uppercase tracking-widest text-gray-dark">
                {companyData.razonSocial}
              </p>
              {companyData.fechaRegistro && (
                <p className="text-xs text-gray-dark mt-1.5 flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  Registrada el {formatDate(companyData.fechaRegistro)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Description inside hero card */}
        {companyData.descripcion && (
          <div className="p-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-dark mb-3">
              Acerca de la empresa
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed bg-surface-container-low p-5 rounded-xl border border-surface-container-low">
              {companyData.descripcion}
            </p>
          </div>
        )}
      </Card>

      {/* Info Grid — General + Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Info Card */}
        <Card className="border-none shadow-soft">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground">
                Información General
              </CardTitle>
              <GeneralInfoForm
                companyData={companyData}
                filters={filters}
                accessToken={session?.user.accessToken}
                onSuccess={handleUpdateCompanyData}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {[
              {
                icon: Briefcase,
                label: "Industria",
                value: companyData.industria?.nombre ?? "No especificada",
              },
              {
                icon: Users,
                label: "Tamaño",
                value: companyData.cantidadEmpleados?.nombre ?? "No especificado",
              },
              {
                icon: CheckCircle,
                label: "Condición Fiscal",
                value: companyData.condicionFiscal?.nombre ?? "No especificada",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-sm transition-all duration-200 group"
              >
                <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-primary/5 transition-colors border border-surface-container-low">
                  <item.icon className="size-5 text-primary" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-dark">
                    {item.label}
                  </p>
                  <p className="font-medium text-foreground text-sm truncate">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

            {companyData.sitioWeb && (
              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-sm transition-all duration-200 group">
                <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-primary/5 transition-colors border border-surface-container-low">
                  <Globe className="size-5 text-primary" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-dark">
                    Sitio Web
                  </p>
                  <a
                    href={companyData.sitioWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:text-secondary transition-colors text-sm truncate block"
                  >
                    {companyData.sitioWeb.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Info Card */}
        <Card className="border-none shadow-soft">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground">
                Contacto
              </CardTitle>
              <ContactInfoForm
                companyData={companyData}
                filters={filters}
                accessToken={session?.user.accessToken}
                onSuccess={handleUpdateCompanyData}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="size-5 text-primary" />
              </div>
              <div className="text-sm min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-dark mb-0.5">
                  Dirección
                </p>
                <p className="font-medium text-foreground">
                  {companyData.direccion || "No especificada"}
                </p>
                {locationParts.length > 0 && (
                  <p className="text-gray-dark text-xs mt-0.5">
                    {locationParts.join(", ")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0">
                <Phone className="size-5 text-primary" />
              </div>
              <div className="text-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-dark mb-0.5">
                  Teléfono
                </p>
                <p className="font-medium text-foreground">
                  {companyData.telefonoContacto || "No especificado"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0">
                <Mail className="size-5 text-primary" />
              </div>
              <div className="text-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-dark mb-0.5">
                  Correo
                </p>
                <p className="font-medium text-foreground">
                  {companyData.correoContacto || "No especificado"}
                </p>
              </div>
            </div>

            {companyData.latitud != null && companyData.longitud != null && (
              <MapPicker
                value={{ lat: companyData.latitud, lng: companyData.longitud }}
                onChange={() => {}}
                className="w-full h-48 rounded-xl overflow-hidden border border-surface-container-low mt-2 pointer-events-none"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin User Card */}
      {admin && (
        <Card className="border-none shadow-soft">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground">
                Usuario Administrador
              </CardTitle>
              <AdminInfoForm
                companyData={companyData}
                filters={filters}
                accessToken={session?.user.accessToken}
                onSuccess={handleUpdateCompanyData}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: User,
                  label: "Nombre",
                  value: admin.nombreCompleto,
                },
                {
                  icon: Mail,
                  label: "Correo",
                  value: admin.correoElectronico,
                  truncate: true,
                },
                {
                  icon: Phone,
                  label: "Teléfono",
                  value: admin.telefono || "No especificado",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl"
                >
                  <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-surface-container-low shrink-0">
                    <item.icon className="size-5 text-primary" />
                  </div>
                  <div className="text-sm min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-dark">
                      {item.label}
                    </p>
                    <p
                      className={`font-medium text-foreground ${item.truncate ? "truncate" : ""}`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-surface-container-low shrink-0">
                  <UserCheck className="size-5 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-dark mb-1">
                    Estado
                  </p>
                  <Pill
                    variant={
                      admin.estadoCuenta?.nombre === "Activa" ? "green" : "yellow"
                    }
                    className="text-[9px] font-semibold tracking-[0.1em] px-2.5 py-0.5 rounded-full"
                    noButton
                  >
                    {admin.estadoCuenta?.nombre ?? "No especificado"}
                  </Pill>
                </div>
              </div>
            </div>

            {admin.fechaRegistro && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-surface-container-low text-xs text-gray-dark">
                <Calendar className="size-3.5" />
                <span>Registrado el {formatDate(admin.fechaRegistro)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
