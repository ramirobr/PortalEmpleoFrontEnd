"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Bell, MailOpen, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Notificacion } from "@/types/user";
import { useSession } from "next-auth/react";
import { fetchApi } from "@/lib/apiClient";

interface NotificacionesCandidatoProps {
  notificacionesIniciales: Notificacion[];
  onNotificacionLeida?: () => void;
}

export default function NotificacionesCandidato({
  notificacionesIniciales,
  onNotificacionLeida,
}: NotificacionesCandidatoProps) {
  const { data: session } = useSession();

  const markAsRead = async (idNotificacion: string) => {
    if (!session?.user?.accessToken) return;

    try {
      const response = await fetchApi(
        `/Notificacion/marcarLeida/${idNotificacion}?esLeida=true`,
        {
          method: "PUT",
          token: session.user.accessToken,
        },
      );

      if (response && response.isSuccess) {
        // Notificar al padre para que recargue el dashboard
        onNotificacionLeida?.();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const sortedNotifications = [...notificacionesIniciales].sort(
    (a, b) =>
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
  );

  const unreadCount = notificacionesIniciales.filter((n) => !n.esLeida).length;

  return (
    <div className="py-8">
      <TituloSubrayado>
        <Bell className="w-8 h-8" />
        Notificaciones
        {unreadCount > 0 && (
          <span className="ml-2 bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">
            {unreadCount} sin leer
          </span>
        )}
      </TituloSubrayado>
      <div className="pt-4 overflow-y-auto space-y-4 max-h-96">
        {sortedNotifications.length === 0 ? (
          <p className="text-gray-500">No tienes notificaciones.</p>
        ) : (
          sortedNotifications.map((notif) => (
            <div
              key={notif.idNotificacion}
              className={`bg-white shadow hover:shadow-md transition-all rounded-xl overflow-hidden p-6 border-l-8 border-l-primary ${notif.esLeida ? "opacity-75" : ""}`}
            >
              <article className="flex justify-between items-center flex-col md:flex-row gap-4">
                <div className="flex flex-row gap-4 flex-1">
                  <div className="flex items-center justify-center text-primary w-12 h-12 bg-primary/10 shrink-0 rounded-full border border-primary/20">
                    <Send size={20} />
                  </div>

                  <div className="space-y-1 py-1">
                    <p className="text-gray-900 font-medium text-base leading-snug">{notif.descripcion}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                      {formatDistanceToNow(new Date(notif.fechaCreacion), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
                {!notif.esLeida && (
                  <button
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-primary text-white font-bold text-xs uppercase rounded-lg hover:bg-secondary transition-colors cursor-pointer min-w-[180px]"
                    onClick={() => markAsRead(notif.idNotificacion)}
                  >
                    Marcar como leído
                    <MailOpen size={16} />
                  </button>
                )}
              </article>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
