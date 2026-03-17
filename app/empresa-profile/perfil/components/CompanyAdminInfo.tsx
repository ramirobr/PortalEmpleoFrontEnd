import { UsuarioAdministrador } from "@/types/company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, UserCheck, Calendar } from "lucide-react";

interface CompanyAdminInfoProps {
  admin: UsuarioAdministrador;
}

export default function CompanyAdminInfo({ admin }: CompanyAdminInfoProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-lg">Usuario Administrador</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Nombre completo</p>
            <p className="font-medium">{admin.nombreCompleto}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Correo electrónico</p>
            <p className="font-medium">{admin.correoElectronico}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="font-medium">{admin.telefono || "No especificado"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <UserCheck className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Estado de la cuenta</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              admin.estadoCuenta?.nombre === "Activa"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {admin.estadoCuenta?.nombre ?? "No especificado"}
            </span>
          </div>
        </div>

        {admin.fechaRegistro && (
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Fecha de registro</p>
              <p className="font-medium">
                {new Date(admin.fechaRegistro).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
