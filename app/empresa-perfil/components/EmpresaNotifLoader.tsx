"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/context/authStore";
import { NotificacionEmpresa } from "@/types/company";

interface EmpresaNotifLoaderProps {
  notificaciones: NotificacionEmpresa[];
}

export default function EmpresaNotifLoader({ notificaciones }: EmpresaNotifLoaderProps) {
  const setNotifications = useAuthStore((s) => s.setNotifications);

  useEffect(() => {
    setNotifications(notificaciones);
  }, [notificaciones, setNotifications]);

  return null;
}
