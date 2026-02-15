"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Bell, MailOpen, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import notificationsData from "@/lib/mocks/notifications.json";

type Notification = {
  id: number;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
};

export default function NotificacionesEmpresa() {
  const [notifications, setNotifications] =
    useState<Notification[]>(notificationsData);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, leida: true } : notif,
      ),
    );
  };

  const activeNotifications = notifications
    .filter((n) => !n.leida)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return (
    <div className="py-8">
      <TituloSubrayado className="text-black">
        <Bell className="w-8 h-8" />
        Notificaciones
      </TituloSubrayado>
      <div className="pt-4 overflow-y-auto space-y-4 max-h-96">
        {activeNotifications.length === 0 ? (
          <p className="text-gray-500">No tienes notificaciones nuevas.</p>
        ) : (
          activeNotifications.map((notif) => (
            <Card
              key={notif.id}
              className={`p-4 gap-3 ${notif.leida ? "opacity-75" : "border-l-4 border-l-primary"}`}
            >
              <article className="flex justify-between items-start flex-col md:flex-row gap-4">
                <div className="flex flex-row gap-4">
                  <div className="flex items-center justify-center text-primary w-10 h-10 bg-primary/10 shrink-0 rounded-lg">
                    <Send size={20} />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-black font-bold leading-none">
                      {notif.titulo}
                    </h4>
                    <p className="text-gray-500 text-sm">{notif.mensaje}</p>
                    <p className="text-xs text-gray-500 capitalize font-medium">
                      {formatDistanceToNow(new Date(notif.fecha), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
                {!notif.leida && (
                  <Button
                    className=" btn btn-primary text-md"
                    onClick={() => markAsRead(notif.id)}
                  >
                    Marcar como leído
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
