import PostulantesRecientes from "./PostulantesRecientes";

export default async function EmpresaProfilePage() {
  // TODO: Fetch company dashboard data
  // const companyDashboard = await getCompanyDashboardByUserId(session.user.accessToken);

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Panel de Empresa</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* TODO: Add company dashboard components here */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Ofertas Publicadas</h2>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Candidatos Activos</h2>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">
            Postulaciones Recibidas
          </h2>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>
      </div>

      <PostulantesRecientes />
    </div>
  );
}
