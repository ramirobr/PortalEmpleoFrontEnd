import { auth } from "@/auth";
import PostulantesRecientes from "./PostulantesRecientes";
import HeroBanner from "./components/HeroBanner";
import AnunciosSection from "./components/AnunciosSection";
import EmpresaSidebarWidgets from "./components/EmpresaSidebarWidgets";
import EmpresaNotifLoader from "./components/EmpresaNotifLoader";
import { getCompanyDashboardByUserId } from "@/lib/company/dashboard";
import { getCompanyProfileById } from "@/lib/company/profile";

export default async function EmpresaProfilePage() {
  const session = await auth();
  if (!session || !session.user.idEmpresa) return;

  const [companyDashboard, companyProfile] = await Promise.all([
    getCompanyDashboardByUserId(session.user.idEmpresa, session.user.accessToken),
    getCompanyProfileById(session.user.idEmpresa, session.user.accessToken),
  ]);

  const companyName = companyProfile?.nombre || "tu empresa";
  const cvsRecibidos = companyDashboard?.postulacionesRecibidas ?? 0;
  const procesosActivos = companyDashboard?.candidatosActivos ?? 0;
  const ofertasCount = companyDashboard?.ofertarPublicadas ?? 0;
  const contrataciones = companyDashboard?.contrataciones ?? 0;
  const candidatosEnRevision = companyDashboard?.candidatosEnRevision ?? 0;

  return (
    <section className="space-y-6" role="region">
      {/* Load empresa notifications into the navbar bell */}
      <EmpresaNotifLoader
        notificaciones={companyDashboard?.notificacionesRecientes || []}
      />

      {/* Hero Banner */}
      <HeroBanner
        companyName={companyName}
        cvsRecibidos={cvsRecibidos}
        procesosActivos={procesosActivos}
        anunciosCount={ofertasCount}
        ofertasActivas={ofertasCount}
        contrataciones={contrataciones}
      />

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          <PostulantesRecientes
            aplicantes={companyDashboard?.aplicantesRecientes || []}
          />
          <AnunciosSection ofertasCount={ofertasCount} />
        </div>

        {/* Right sidebar (1/3) */}
        <div className="lg:col-span-1">
          <EmpresaSidebarWidgets
            companyProfile={companyProfile ?? null}
            aplicantesRecientes={companyDashboard?.aplicantesRecientes || []}
            ofertasCount={ofertasCount}
            contrataciones={contrataciones}
            candidatosEnRevision={candidatosEnRevision}
          />
        </div>
      </div>
    </section>
  );
}
