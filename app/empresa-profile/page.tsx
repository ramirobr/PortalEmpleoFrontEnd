import { auth } from "@/auth";
import PostulantesRecientes from "./PostulantesRecientes";
import NotificacionesEmpresa from "./components/NotificacionesEmpresa";
import { getCompanyDashboardByUserId } from "@/lib/company/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, FileText, Plus, User, Settings } from "lucide-react";
import Link from "next/link";

export default async function EmpresaProfilePage() {
  const session = await auth();
  if (!session || !session.user.idEmpresa) return;
  const companyDashboard = await getCompanyDashboardByUserId(
    session.user.idEmpresa,
    session.user.accessToken
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Bienvenido a tu Panel de Empresa
        </h1>
        <p className="text-muted-foreground">
          Gestiona tus ofertas de empleo, revisa postulaciones y administra tu perfil.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ofertas Publicadas</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyDashboard?.ofertarPublicadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidatos Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyDashboard?.candidatosActivos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Postulaciones Recibidas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyDashboard?.postulacionesRecibidas}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/empresa-profile/crear-empleo">
              <Plus className="h-4 w-4" /> Crear Nueva Oferta
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/empresa-profile/perfil">
              <User className="h-4 w-4" /> Ver Perfil
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/empresa-profile/empleos">
              <Briefcase className="h-4 w-4" /> Gestionar Empleos
            </Link>
          </Button>
        </div>
      </div>

      <PostulantesRecientes aplicantes={companyDashboard?.aplicantesRecientes || []} />

      <NotificacionesEmpresa />
    </div>
  );
}
