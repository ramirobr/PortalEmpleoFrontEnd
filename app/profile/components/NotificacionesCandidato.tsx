"use client";

import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Bell, MailOpen, Send, Clock } from "lucide-react";
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
      <div className="pt-4 overflow-y-auto space-y-6 max-h-[500px] px-2">
        {sortedNotifications.length === 0 ? (
          <p className="text-slate-500 font-medium italic">No tienes notificaciones en este momento.</p>
        ) : (
          sortedNotifications.map((notif) => (
            <div
              key={notif.idNotificacion}
              className={`bg-white shadow-sm hover:shadow-xl transition-all duration-500 rounded-xl overflow-hidden p-8 border border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 ${notif.esLeida ? "opacity-60 grayscale-[0.5]" : "group hover:-translate-y-1"}`}
            >
              <div className="flex flex-row gap-6 flex-1 w-full">
                <div className="flex items-center justify-center text-primary w-14 h-14 bg-primary/5 shrink-0 rounded-2xl border border-primary/10 shadow-inner">
                  <Send size={24} className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
                </div>

                <div className="space-y-2 py-1">
                  <p className="text-slate-900 font-bold text-lg leading-snug tracking-tight">
                    {notif.descripcion}
                  </p>
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] flex items-center gap-2 italic">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDistanceToNow(new Date(notif.fechaCreacion), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </p>
                </div>
              </div>
              
              {!notif.esLeida && (
                <button
                  className="relative group/btn flex items-center justify-center gap-2.5 px-12 py-2 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-full hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-1 min-w-[200px] w-full md:w-auto"
                  onClick={() => markAsRead(notif.idNotificacion)}
                >
                  <div className="absolute inset-x-0 top-0 h-full w-full bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 skew-x-12" />
                  <span className="relative z-10">Confirmar lectura</span>
                  <MailOpen className="size-4 relative z-10" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
