"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <TituloSubrayado className="text-black">
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
            <Card
              key={notif.idNotificacion}
              className={`p-4 gap-3 ${notif.esLeida ? "opacity-75" : "border-l-4 border-l-primary"}`}
            >
              <article className="flex justify-between items-start flex-col md:flex-row gap-4">
                <div className="flex flex-row gap-4">
                  <div className="flex items-center justify-center text-primary w-10 h-10 bg-primary/10 shrink-0 rounded-lg">
                    <Send size={20} />
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-700 text-sm">{notif.descripcion}</p>
                    <p className="text-xs text-gray-500 capitalize font-medium">
                      {formatDistanceToNow(new Date(notif.fechaCreacion), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
                {!notif.esLeida && (
                  <Button
                    className=" btn btn-primary text-md"
                    onClick={() => markAsRead(notif.idNotificacion)}
                    disabled={isLoading === notif.idNotificacion}
                  >
                    {isLoading === notif.idNotificacion ? "Marcando..." : "Marcar como leído"}
                    <MailOpen />
                  </Button>
                )}
              </article>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
