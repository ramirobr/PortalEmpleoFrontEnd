import { DashboardInfoData } from "@/types/user";

export default function Dashboard({
  visitas,
  elegido,
  revision,
  totalApplications,
}: DashboardInfoData) {
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
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="font-semibold mb-2">Notificaciones</div>
          <div className="flex items-start gap-2 mb-2">
            <div className="bg-green-100 rounded-full p-2">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div className="text-sm">
              Aplicación rechazada{" "}
              <span className="text-primary font-semibold">
                Junior Graphic Designer (Web)
              </span>{" "}
              by <span className="font-semibold">Employer</span>.<br />
              <span className="text-xs text-gray-400">2 years ago</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
