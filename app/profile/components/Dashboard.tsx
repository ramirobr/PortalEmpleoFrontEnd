import { DashboardInfoData, Notificacion } from "@/types/user";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Hace un momento";
  if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  if (diffDays < 30) return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
  return date.toLocaleDateString("es-ES");
}

function NotificacionItem({ notificacion }: { notificacion: Notificacion }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className="text-green-600"
        >
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-700">{notificacion.descripcion}</p>
        <span className="text-xs text-gray-400">
          {formatRelativeTime(notificacion.fechaCreacion)}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard({
  visitas,
  elegido,
  revision,
  totalApplications,
  notificaciones,
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
          <div className="font-semibold mb-4">Notificaciones</div>
          {notificaciones && notificaciones.length > 0 ? (
            <div className="space-y-1">
              {notificaciones.map((notificacion) => (
                <NotificacionItem
                  key={notificacion.idNotificacion}
                  notificacion={notificacion}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No tienes notificaciones</p>
          )}
        </div>
      </div>
    </>
  );
}
