interface DashboardProps {
  visitas: number;
  elegido: number;
  revision: number;
  totalApplications: number;
}

export default function Dashboard({
  visitas,
  elegido,
  revision,
  totalApplications,
}: DashboardProps) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-600">
            {totalApplications}
          </div>
          <div className="text-sm text-gray-500 mt-2">Aplicados</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-yellow-500">{revision}</div>
          <div className="text-sm text-gray-500 mt-2">Revisión</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-red-500">{visitas}</div>
          <div className="text-sm text-gray-500 mt-2">Vistas</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-primary">{elegido}</div>
          <div className="text-sm text-gray-500 mt-2">Elegido</div>
        </div>
      </div>
    </>
  );
}
