"use client";

import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { PremiumButton } from "@/components/shared/components/PremiumButton";
import { Bell, MailOpen, Send, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { NotificacionEmpresa as NotificacionEmpresaType } from "@/types/company";
import { marcarNotificacionEmpresaLeida, eliminarNotificacionEmpresa } from "@/lib/company/dashboard";

interface NotificacionesEmpresaProps {
  notificaciones: NotificacionEmpresaType[];
  notificacionesNoLeidas: number;
  token?: string;
}

export default function NotificacionesEmpresa({
  notificaciones,
  notificacionesNoLeidas,
  token,
}: NotificacionesEmpresaProps) {
  const { refresh } = useRouter();
  const prevNotificacionesRef = useRef(notificaciones);
  const [notifications, setNotifications] = useState<NotificacionEmpresaType[]>(notificaciones);

  if (notificaciones !== prevNotificacionesRef.current) {
    prevNotificacionesRef.current = notificaciones;
    setNotifications(notificaciones);
  }

  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const markAsRead = async (id: string) => {
    setIsLoading(id);
    const result = await marcarNotificacionEmpresaLeida(id, token);
    setIsLoading(null);

    if (result?.isSuccess) {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.idNotificacion === id ? { ...notif, esLeida: true } : notif,
        ),
      );
      refresh();
    }
  };

  const deleteNotification = async (id: string) => {
    setDeletingId(id);
    const result = await eliminarNotificacionEmpresa(id, token);
    setDeletingId(null);

    if (result?.isSuccess) {
      setNotifications((prev) => prev.filter((n) => n.idNotificacion !== id));
    }
  };

  const unreadCount = notifications.filter((n) => !n.esLeida).length;

  const sortedNotifications = notifications.toSorted(
    (a, b) =>
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
  );

  return (
    <div className="py-8">
      <TituloSubrayado className="text-primary">
        <Bell className="size-8" />
        Notificaciones
        {unreadCount > 0 && (
          <span className="ml-2 px-2 py-1 text-sm bg-primary text-white rounded-full">
            {unreadCount}
          </span>
        )}
      </TituloSubrayado>
      <div className="pt-4 overflow-y-auto space-y-4 max-h-[420px]">
        {sortedNotifications.length === 0 ? (
          <p className="text-slate-500">No tienes notificaciones.</p>
        ) : (
          sortedNotifications.map((notif) => {
            const timeAgo = formatDistanceToNow(new Date(notif.fechaCreacion), {
              addSuffix: true,
              locale: es,
            });
            return (
              <div
                key={notif.idNotificacion}
                role="button"
                tabIndex={0}
                className={`bg-white shadow hover:shadow-md transition-all rounded-xl overflow-hidden p-6 border-l-8 border-l-primary ${notif.esLeida ? "opacity-60" : "cursor-pointer"}`}
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
                <article className="flex justify-between items-center flex-col lg:flex-row gap-4">
                  <div className="flex flex-row gap-4 flex-1">
                    <div className="flex items-center justify-center text-primary size-12 bg-primary/10 shrink-0 rounded-full border border-primary/20">
                      <Send size={20} />
                    </div>

                    <div className="space-y-1 py-1">
                      <p className="text-slate-900 font-medium text-base leading-snug">{notif.descripcion}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest" suppressHydrationWarning>
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
                        className="flex-1 lg:flex-none lg:min-w-[160px] text-[10px] tracking-widest font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.idNotificacion);
                        }}
                        isLoading={isLoading === notif.idNotificacion}
                        icon={<MailOpen className="size-4" />}
                        iconPosition="right"
                      >
                        Marcar como leído
                      </PremiumButton>
                    )}
                    <button
                      title="Eliminar notificación"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.idNotificacion);
                      }}
                      disabled={deletingId === notif.idNotificacion}
                      className="p-2.5 rounded-lg border border-zinc-200 hover:border-red-200 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
