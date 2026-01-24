import { CompanyProfileData } from "@/types/company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Globe, Users, Briefcase, CheckCircle } from "lucide-react";

interface CompanyProfileCardProps {
  profile: CompanyProfileData;
}

export default function CompanyProfileCard({ profile }: CompanyProfileCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center gap-4">
          {profile.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt={`Logo de ${profile.nombre}`}
              className="w-20 h-20 rounded-lg object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">{profile.nombre}</CardTitle>
              {profile.estado && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  profile.estado.nombre === "Activo" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {profile.estado.nombre}
                </span>
              )}
            </div>
            <p className="text-muted-foreground">{profile.razonSocial}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {profile.descripcion && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Acerca de la empresa</h3>
            <p className="text-gray-600">{profile.descripcion}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Briefcase className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Industria</p>
              <p className="font-medium">{profile.industria?.nombre ?? "No especificada"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Tamaño de la empresa</p>
              <p className="font-medium">{profile.cantidadEmpleados?.nombre ?? "No especificado"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Condición Fiscal</p>
              <p className="font-medium">{profile.condicionFiscal?.nombre ?? "No especificada"}</p>
            </div>
          </div>

          {profile.sitioWeb && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Globe className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Sitio Web</p>
                <a
                  href={profile.sitioWeb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {profile.sitioWeb.replace(/^https?:\/\//, "")}
                </a>
              </div>
            </div>
          )}
        </div>

        {profile.fechaRegistro && (
          <p className="text-sm text-gray-400 mt-6">
            Empresa registrada el {new Date(profile.fechaRegistro).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
