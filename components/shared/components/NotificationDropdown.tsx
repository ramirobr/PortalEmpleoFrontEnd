"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Send, Clock, MailOpen, X, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/context/authStore";
import { fetchApi } from "@/lib/apiClient";
import { ROLES } from "@/types/auth";

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
  const removeNotification = useAuthStore((s) => s.removeNotification);
  const panelRef = useRef<HTMLDivElement>(null);
  const isCompanyAdmin = session?.user?.role === ROLES.AdministradorEmpresa;
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onCloseRef.current();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  const markAsRead = async (idNotificacion: string) => {
    if (!session?.user?.accessToken) return;
    try {
      const endpoint = isCompanyAdmin
        ? `/NotificacionesEmpresa/marcarLeida/${idNotificacion}`
        : `/Notificacion/marcarLeida/${idNotificacion}?esLeida=true`;
      const response = await fetchApi(endpoint, {
        method: "PUT",
        token: session.user.accessToken,
      });
      if (response && (response as { isSuccess?: boolean }).isSuccess) {
        markNotificationRead(idNotificacion);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (idNotificacion: string) => {
    if (!session?.user?.accessToken) return;
    setDeletingId(idNotificacion);
    try {
      const endpoint = isCompanyAdmin
        ? `/NotificacionesEmpresa/eliminar/${idNotificacion}`
        : `/Notificacion/eliminar/${idNotificacion}`;
      const response = await fetchApi(endpoint, {
        method: "DELETE",
        token: session.user.accessToken,
      });
      if (response && (response as { isSuccess?: boolean }).isSuccess) {
        removeNotification(idNotificacion);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  const sorted = notifications.toSorted(
    (a, b) =>
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
  );

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-zinc-100 z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Bell className="size-5 text-primary" />
          <span className="font-bold text-slate-800 text-base">Notificaciones</span>
          {unreadNotifications > 0 && (
            <span className="bg-primary text-white text-[11px] font-bold rounded-full px-2 py-0.5">
              {unreadNotifications} sin leer
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X className="size-4 text-slate-500" />
        </button>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[420px]">
        {sorted.length === 0 ? (
          <div className="px-5 py-10 text-center text-slate-400 text-sm italic">
            No tienes notificaciones en este momento.
          </div>
        ) : (
          sorted.map((notif) => {
            const timeAgo = formatDistanceToNow(new Date(notif.fechaCreacion), {
              addSuffix: true,
              locale: es,
            });
            return (
              <div
                key={notif.idNotificacion}
                role="button"
                tabIndex={0}
                className={`flex items-start gap-3 px-5 py-4 border-b border-zinc-50 last:border-0 transition-colors ${
                  notif.esLeida
                    ? "opacity-60"
                    : "bg-primary/[0.03] hover:bg-primary/[0.06] cursor-pointer"
                }`}
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
                {/* Icon */}
                <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Send className="size-4 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${notif.esLeida ? "text-slate-500" : "text-slate-800 font-medium"}`}>
                    {notif.descripcion}
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-slate-400 mt-1" suppressHydrationWarning>
                    <Clock className="size-3" />
                    {timeAgo}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {!notif.esLeida && (
                    <button
                      title="Marcar como leída"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notif.idNotificacion);
                      }}
                      className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors cursor-pointer"
                    >
                      <MailOpen className="size-4" />
                    </button>
                  )}
                  <button
                    title="Eliminar notificación"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.idNotificacion);
                    }}
                    disabled={deletingId === notif.idNotificacion}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
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
