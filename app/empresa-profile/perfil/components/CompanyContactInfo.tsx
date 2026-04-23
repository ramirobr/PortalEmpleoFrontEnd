import { CompanyProfileData } from "@/types/company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, FileText, Mail, Globe2 } from "lucide-react";

interface CompanyContactInfoProps {
  profile: CompanyProfileData;
}

export default function CompanyContactInfo({ profile }: CompanyContactInfoProps) {
  const locationParts = [
    profile.ciudad?.nombre,
    profile.provincia?.nombre,
    profile.pais?.nombre,
  ].filter(Boolean);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-lg">Información de Contacto</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Dirección</p>
            <p className="font-medium">{profile.direccion || "No especificada"}</p>
            {locationParts.length > 0 && (
              <p className="text-sm text-gray-500">{locationParts.join(", ")}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="font-medium">{profile.telefonoContacto || "No especificado"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Correo de contacto</p>
            <p className="font-medium">{profile.correoContacto || "No especificado"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Documento</p>
            <p className="font-medium">{profile.numeroDocumento || "No especificado"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
