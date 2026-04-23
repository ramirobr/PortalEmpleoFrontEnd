"use client";

import { useEffect, useRef } from "react";
import { Bell, Send, Clock, MailOpen, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/context/authStore";
import { fetchApi } from "@/lib/apiClient";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({
  isOpen,
  onClose,
}: NotificationDropdownProps) {
  const { data: session } = useSession();
  const notifications = useAuthStore((s) => s.notifications);
  const unreadNotifications = useAuthStore((s) => s.unreadNotifications);
  const markNotificationRead = useAuthStore((s) => s.markNotificationRead);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const markAsRead = async (idNotificacion: string) => {
    if (!session?.user?.accessToken) return;
    try {
      const response = await fetchApi(
        `/Notificacion/marcarLeida/${idNotificacion}?esLeida=true`,
        { method: "PUT", token: session.user.accessToken },
      );
      if (response && (response as { isSuccess?: boolean }).isSuccess) {
        markNotificationRead(idNotificacion);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (!isOpen) return null;

  const sorted = [...notifications].sort(
    (a, b) =>
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
  );

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <span className="font-bold text-gray-800 text-base">Notificaciones</span>
          {unreadNotifications > 0 && (
            <span className="bg-primary text-white text-[10px] font-bold rounded-full px-2 py-0.5">
              {unreadNotifications} sin leer
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[420px]">
        {sorted.length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-400 text-sm italic">
            No tienes notificaciones en este momento.
          </div>
        ) : (
          sorted.map((notif) => (
            <div
              key={notif.idNotificacion}
              className={`flex items-start gap-3 px-5 py-4 border-b border-gray-50 last:border-0 transition-colors ${
                notif.esLeida ? "opacity-60" : "bg-primary/[0.03] hover:bg-primary/[0.06]"
              }`}
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Send className="w-4 h-4 text-primary" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${notif.esLeida ? "text-gray-500" : "text-gray-800 font-medium"}`}>
                  {notif.descripcion}
                </p>
                <p className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(notif.fechaCreacion), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </div>

              {/* Mark as read button */}
              {!notif.esLeida && (
                <button
                  title="Marcar como leída"
                  onClick={() => markAsRead(notif.idNotificacion)}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors cursor-pointer"
                >
                  <MailOpen className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
