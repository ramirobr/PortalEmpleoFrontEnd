"use client";

import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Bell, MailOpen, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NotificacionEmpresa as NotificacionEmpresaType } from "@/types/company";
import { marcarNotificacionEmpresaLeida } from "@/lib/company/dashboard";

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
  const router = useRouter();
  const [notifications, setNotifications] =
    useState<NotificacionEmpresaType[]>(notificaciones);
  const [isLoading, setIsLoading] = useState<string | null>(null);

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
      router.refresh();
    }
  };

  const activeNotifications = notifications
    .filter((n) => !n.esLeida)
    .sort(
      (a, b) =>
        new Date(b.fechaCreacion).getTime() -
        new Date(a.fechaCreacion).getTime(),
    );

  return (
    <div className="py-8">
      <TituloSubrayado className="text-primary">
        <Bell className="w-8 h-8" />
        Notificaciones
        {notificacionesNoLeidas > 0 && (
          <span className="ml-2 px-2 py-1 text-sm bg-primary text-white rounded-full">
            {notificacionesNoLeidas}
          </span>
        )}
      </TituloSubrayado>
      <div className="pt-4 overflow-y-auto space-y-4 max-h-[420px]">
        {activeNotifications.length === 0 ? (
          <p className="text-gray-500">No tienes notificaciones nuevas.</p>
        ) : (
          activeNotifications.map((notif) => (
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
                    disabled={isLoading === notif.idNotificacion}
                  >
                    {isLoading === notif.idNotificacion ? "Marcando..." : "Marcar como leído"}
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
