"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  CompanyProfileData,
  CompanyProfileFiltersResponse,
} from "@/types/company";
import {
  Briefcase,
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
    <div className="space-y-4">
      <Card className="py-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <LogoUploadDialog
              companyId={companyData.idEmpresa}
              companyName={companyData.nombre}
              accessToken={session?.user.accessToken}
            />

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{companyData.nombre}</h1>
                {companyData.estado && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      companyData.estado.nombre === "Activo"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {companyData.estado.nombre}
                  </span>
                )}
              </div>
              <p className="text-gray-500">{companyData.razonSocial}</p>
              {companyData.fechaRegistro && (
                <p className="text-xs text-gray-400 mt-1">
                  Registrada el {formatDate(companyData.fechaRegistro)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="py-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
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
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-500">Industria:</span>
              <span className="text-sm font-medium">
                {companyData.industria?.nombre ?? "No especificada"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-500">Tamaño:</span>
              <span className="text-sm font-medium">
                {companyData.cantidadEmpleados?.nombre ?? "No especificado"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-500">Condición Fiscal:</span>
              <span className="text-sm font-medium">
                {companyData.condicionFiscal?.nombre ?? "No especificada"}
              </span>
            </div>
            {companyData.sitioWeb && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-500">Web:</span>
                <a
                  href={companyData.sitioWeb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline truncate"
                >
                  {companyData.sitioWeb.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="py-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
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
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary mt-0.5" />
              <div className="text-sm">
                <span className="font-medium">
                  {companyData.direccion || "No especificada"}
                </span>
                {locationParts.length > 0 && (
                  <p className="text-gray-500 text-xs">
                    {locationParts.join(", ")}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {companyData.telefonoContacto || "No especificado"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {companyData.correoContacto || "No especificado"}
              </span>
            </div>
          </CardContent>
        </Card>

        {admin && (
          <Card className="md:col-span-2 py-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">Nombre</p>
                    <p className="font-medium">{admin.nombreCompleto}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">Correo</p>
                    <p className="font-medium truncate">
                      {admin.correoElectronico}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">Teléfono</p>
                    <p className="font-medium">
                      {admin.telefono || "No especificado"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-primary" />
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">Estado</p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        admin.estadoCuenta?.nombre === "Activa"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {admin.estadoCuenta?.nombre ?? "No especificado"}
                    </span>
                  </div>
                </div>
              </div>
              {admin.fechaRegistro && (
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>Registrado el {formatDate(admin.fechaRegistro)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {companyData.descripcion && (
        <Card className="py-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Acerca de la empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600">{companyData.descripcion}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
