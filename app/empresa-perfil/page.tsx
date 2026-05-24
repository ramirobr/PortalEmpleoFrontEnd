import { auth } from "@/auth";
import PostulantesRecientes from "./PostulantesRecientes";
import AnunciosSection from "./components/AnunciosSection";
import EmpresaSidebarWidgets from "./components/EmpresaSidebarWidgets";
import EmpresaNotifLoader from "./components/EmpresaNotifLoader";
import EmpresaDashboardContainer from "./components/EmpresaDashboardContainer";
import { getCompanyDashboardByUserId } from "@/lib/company/dashboard";
import { getCompanyProfileById } from "@/lib/company/profile";

export default async function EmpresaProfilePage() {
  const session = await auth();
  if (!session || !session.user.idEmpresa) return null;

  const [companyDashboard, companyProfile] = await Promise.all([
    getCompanyDashboardByUserId(session.user.idEmpresa, session.user.accessToken),
    getCompanyProfileById(session.user.idEmpresa, session.user.accessToken),
  ]);

  if (!companyDashboard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <h1 className="text-2xl font-semibold text-slate-800">No se pudo cargar el perfil</h1>
        <p className="text-slate-500 mt-2">Por favor, intenta de nuevo más tarde.</p>
      </div>
    );
  }

  const {
    ofertarPublicadas: ofertasCount,
    aplicantesRecientes,
    contrataciones,
    candidatosEnRevision,
    notificacionesRecientes,
  } = companyDashboard;

  const cvsRecibidos = companyDashboard.postulacionesRecibidas ?? 0;
  const procesosActivos = companyDashboard.candidatosActivos ?? 0;
  const anunciosCount = ofertasCount;
  const ofertasActivas = ofertasCount;

  return (
    <EmpresaDashboardContainer
      companyName={companyProfile?.razonSocial || "Empresa"}
      cvsRecibidos={cvsRecibidos}
      procesosActivos={procesosActivos}
      anunciosCount={anunciosCount}
      ofertasActivas={ofertasActivas}
      contrataciones={contrataciones}
      companyProfile={companyProfile ?? null}
      aplicantesRecientes={aplicantesRecientes}
      candidatosEnRevision={candidatosEnRevision}
    >
      <EmpresaNotifLoader
        notificaciones={notificacionesRecientes || []}
      />

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-10">
          <AnunciosSection ofertasCount={ofertasCount} />
          
          <PostulantesRecientes aplicantes={aplicantesRecientes} />
        </div>

        {/* Sidebar Column */}
        <aside className="lg:col-span-4 space-y-6">
          <EmpresaSidebarWidgets
            aplicantesRecientes={aplicantesRecientes}
            ofertasCount={ofertasCount}
            contrataciones={contrataciones}
            candidatosEnRevision={candidatosEnRevision}
          />
        </aside>
      </main>
    </EmpresaDashboardContainer>
  );
}
