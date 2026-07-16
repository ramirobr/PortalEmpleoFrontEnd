"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/context/authStore";
import { ROLES } from "@/types/auth";
import type { Conversacion } from "@/types/mensajes";
import { parseBackendDate } from "@/lib/utils";
import {
  fetchConversacionesByUsuario,
  fetchConversacionesByEmpresa,
} from "@/lib/mensajes/api";

interface MessageDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MessageDropdown({ isOpen, onClose }: MessageDropdownProps) {
  const { data: session } = useSession();
  const userId = useAuthStore((s) => s.id);
  const idEmpresa = useAuthStore((s) => s.idEmpresa);
  const openFloatingChat = useAuthStore((s) => s.openFloatingChat);
  const setUnreadMessages = useAuthStore((s) => s.setUnreadMessages);
  const panelRef = useRef<HTMLDivElement>(null);

  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [loaded, setLoaded] = useState(false);

  const isCompanyAdmin =
    session?.user?.role === ROLES.AdministradorEmpresa ||
    session?.user?.role === ROLES.AdministradorDeEmpresa;

  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  // Cerrar al click fuera
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

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCloseRef.current(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Cargar conversaciones al abrir (una sola vez por sesión)
  useEffect(() => {
    if (!isOpen || loaded || !session?.user.accessToken) return;
    const fetch = isCompanyAdmin && idEmpresa
      ? fetchConversacionesByEmpresa(idEmpresa, session.user.accessToken)
      : userId
        ? fetchConversacionesByUsuario(userId, session.user.accessToken)
        : Promise.resolve(null);

    fetch.then((res) => {
      if (res?.isSuccess) {
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.fechaUltimoMensaje).getTime() - new Date(a.fechaUltimoMensaje).getTime()
        );
        setConversaciones(sorted);
        const total = sorted.reduce((s, c) => s + c.mensajesNoLeidos, 0);
        setUnreadMessages(total);
      }
      setLoaded(true);
    });
  }, [isOpen, loaded, session, isCompanyAdmin, idEmpresa, userId, setUnreadMessages]);

  // Recargar al volver a abrir
  useEffect(() => {
    if (!isOpen) setLoaded(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (conv: Conversacion) => {
    const nombre = isCompanyAdmin ? (conv.nombreUsuario ?? "Candidato") : (conv.nombreEmpresa ?? "Empresa");
    openFloatingChat(conv.idConversacion, nombre);
    // Limpiar no leídos de esta conversación localmente
    setConversaciones((prev) =>
      prev.map((c) => c.idConversacion === conv.idConversacion ? { ...c, mensajesNoLeidos: 0 } : c)
    );
    onClose();
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-zinc-100 z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5 text-primary" />
          <span className="font-bold text-slate-800 text-base">Mensajes</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X className="size-4 text-slate-500" />
        </button>
      </div>

      {/* Lista */}
      <div className="overflow-y-auto max-h-[380px]">
        {!loaded ? (
          <div className="px-5 py-8 text-center text-slate-400 text-sm italic">Cargando…</div>
        ) : conversaciones.length === 0 ? (
          <div className="px-5 py-8 text-center text-slate-400 text-sm italic">
            No tienes conversaciones aún.
          </div>
        ) : (
          conversaciones.map((conv) => {
            const nombre = isCompanyAdmin
              ? (conv.nombreUsuario ?? "Candidato")
              : (conv.nombreEmpresa ?? "Empresa");
            const timeAgo = formatDistanceToNow(parseBackendDate(conv.fechaUltimoMensaje), {
              addSuffix: true,
              locale: es,
            });
            return (
              <button
                key={conv.idConversacion}
                type="button"
                onClick={() => handleSelect(conv)}
                className="w-full text-left flex items-start gap-3 px-5 py-4 border-b border-zinc-50 last:border-0 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                {/* Avatar placeholder */}
                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                  {nombre.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm truncate ${conv.mensajesNoLeidos > 0 ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`}>
                      {nombre}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0" suppressHydrationWarning>
                      {timeAgo}
                    </span>
                  </div>
                  {conv.tituloVacante && (
                    <p className="text-xs text-primary/70 truncate">{conv.tituloVacante}</p>
                  )}
                  <div className="flex items-center justify-between mt-0.5">
                    <p className={`text-xs truncate ${conv.mensajesNoLeidos > 0 ? "text-slate-700 font-medium" : "text-slate-400"}`}>
                      {conv.ultimoMensaje ?? "—"}
                    </p>
                    {conv.mensajesNoLeidos > 0 && (
                      <span className="shrink-0 bg-primary text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-tight ml-2">
                        {conv.mensajesNoLeidos}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
