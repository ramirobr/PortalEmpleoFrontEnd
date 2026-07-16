"use client";

import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { PremiumButton } from "@/components/shared/components/PremiumButton";
import { Bell, MailOpen, Send, Clock, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { parseBackendDate } from "@/lib/utils";
import { useState, useRef } from "react";
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
  const prevNotificacionesRef = useRef(notificacionesIniciales);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(notificacionesIniciales);

  if (notificacionesIniciales !== prevNotificacionesRef.current) {
    prevNotificacionesRef.current = notificacionesIniciales;
    setNotificaciones(notificacionesIniciales);
  }

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const markAsRead = async (idNotificacion: string) => {
    if (!session?.user?.accessToken) return;
    try {
      const response = await fetchApi(
        `/Notificacion/marcarLeida/${idNotificacion}?esLeida=true`,
        { method: "PUT", token: session.user.accessToken },
      );
      if (response && (response as { isSuccess?: boolean }).isSuccess) {
        setNotificaciones((prev) =>
          prev.map((n) =>
            n.idNotificacion === idNotificacion ? { ...n, esLeida: true } : n,
          ),
        );
        onNotificacionLeida?.();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (idNotificacion: string) => {
    if (!session?.user?.accessToken) return;
    setDeletingId(idNotificacion);
    try {
      const response = await fetchApi(
        `/Notificacion/eliminar/${idNotificacion}`,
        { method: "DELETE", token: session.user.accessToken },
      );
      if (response && (response as { isSuccess?: boolean }).isSuccess) {
        setNotificaciones((prev) =>
          prev.filter((n) => n.idNotificacion !== idNotificacion),
        );
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const sortedNotifications = notificaciones.toSorted(
    (a, b) =>
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
  );

  const unreadCount = notificaciones.filter((n) => !n.esLeida).length;

  return (
    <div className="py-8">
      <TituloSubrayado>
        <Bell className="size-8" />
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
          sortedNotifications.map((notif) => {
            const timeAgo = formatDistanceToNow(parseBackendDate(notif.fechaCreacion), {
              addSuffix: true,
              locale: es,
            });
            return (
              <div
                key={notif.idNotificacion}
                role="button"
                tabIndex={0}
                className={`bg-white shadow-sm hover:shadow-xl transition-all duration-500 rounded-xl overflow-hidden p-8 border border-zinc-50 flex flex-col lg:flex-row justify-between items-center gap-6 ${notif.esLeida ? "opacity-60 grayscale-[0.5]" : "group hover:-translate-y-1 cursor-pointer"}`}
                onClick={() => {
                  if (!notif.esLeida) markAsRead(notif.idNotificacion);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!notif.esLeida) markAsRead(notif.idNotificacion);
                  }
                }}
              >
                <div className="flex flex-row gap-6 flex-1 w-full">
                  <div className="flex items-center justify-center text-primary size-14 bg-primary/5 shrink-0 rounded-2xl border border-primary/10 shadow-inner">
                    <Send size={24} className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
                  </div>

                  <div className="space-y-2 py-1">
                    <p className="text-slate-900 font-bold text-lg leading-snug tracking-tight">
                      {notif.descripcion}
                    </p>
                    <p className="text-[11px] text-slate-600 font-bold uppercase tracking-[0.2em] flex items-center gap-2 italic">
                      <Clock className="size-3.5" />
                      {timeAgo}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center gap-3 w-full lg:w-auto"
                >
                  {!notif.esLeida && (
                    <PremiumButton
                      variant="primary"
                      size="sm"
                      className="flex-1 lg:flex-none lg:min-w-[180px] text-[10px] tracking-widest font-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notif.idNotificacion);
                      }}
                      icon={<MailOpen className="size-4" />}
                      iconPosition="right"
                    >
                      Confirmar lectura
                    </PremiumButton>
                  )}
                  <button
                    title="Eliminar notificación"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.idNotificacion);
                    }}
                    disabled={deletingId === notif.idNotificacion}
                    className="p-2.5 rounded-full border border-zinc-200 hover:border-red-200 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
