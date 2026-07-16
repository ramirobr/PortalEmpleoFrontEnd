"use client";

import { useEffect } from "react";
import { HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useAuthStore } from "@/context/authStore";
import { Notificacion } from "@/types/user";
import type { Mensaje } from "@/types/mensajes";

export default function NotificationRealtimeClient() {
  const { data: session, status } = useSession();
  const addNotification = useAuthStore((s) => s.addNotification);
  const addUnreadMessage = useAuthStore((s) => s.addUnreadMessage);
  const setLastIncomingMessage = useAuthStore((s) => s.setLastIncomingMessage);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.accessToken) {
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API?.replace(/\/$/, "");
    if (!apiUrl) {
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(`${apiUrl}/hubs/notifications`, {
        accessTokenFactory: () => session.user.accessToken,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on("notification:new", (notification: Notificacion) => {
      addNotification(notification);
      toast.info(notification.descripcion);
    });

    connection.on("message:new", (msg: Mensaje) => {
      addUnreadMessage();
      setLastIncomingMessage(msg);
    });

    void connection.start().catch((error) => {
      console.error("SignalR notification connection error:", error);
    });

    return () => {
      connection.off("notification:new");
      connection.off("message:new");
      if (connection.state !== HubConnectionState.Disconnected) {
        void connection.stop();
      }
    };
  }, [addNotification, addUnreadMessage, setLastIncomingMessage, session?.user?.accessToken, status]);

  return null;
}
