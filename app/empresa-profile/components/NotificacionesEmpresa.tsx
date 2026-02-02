"use client";

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
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, leida: true } : notif)
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-primary mb-4">Notificaciones</h2>
      <div className="max-h-96 overflow-y-auto space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 bg-white rounded-lg shadow ${notif.leida ? 'opacity-75' : 'border-l-4 border-primary'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{notif.titulo}</h3>
                <p className="text-gray-600">{notif.mensaje}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(notif.fecha).toLocaleDateString()}
                </p>
              </div>
              {!notif.leida && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="text-primary hover:underline"
                >
                  Marcar como leída
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}