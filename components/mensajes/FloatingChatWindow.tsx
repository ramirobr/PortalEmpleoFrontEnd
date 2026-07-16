"use client";

import { useEffect, useRef, useState } from "react";
import { X, Minus, ChevronUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/context/authStore";
import { ROLES } from "@/types/auth";
import { fetchMensajes, enviarMensaje, marcarLeidosByConversacion } from "@/lib/mensajes/api";
import ChatWindow from "@/components/mensajes/ChatWindow";
import MessageInput from "@/components/mensajes/MessageInput";
import type { Mensaje } from "@/types/mensajes";

const WINDOW_WIDTH = 360;
const WINDOW_GAP = 8;
const WINDOW_RIGHT_BASE = 16;

interface SingleFloatingChatProps {
  convId: string;
  nombre: string;
  index: number;
}

function SingleFloatingChat({ convId, nombre, index }: SingleFloatingChatProps) {
  const { data: session } = useSession();
  const closeFloatingChat = useAuthStore((s) => s.closeFloatingChat);
  const lastIncomingMessage = useAuthStore((s) => s.lastIncomingMessage);
  const setLastIncomingMessage = useAuthStore((s) => s.setLastIncomingMessage);

  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [minimized, setMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const loaded = useRef(false);

  const isCompanyAdmin =
    session?.user?.role === ROLES.AdministradorEmpresa ||
    session?.user?.role === ROLES.AdministradorDeEmpresa;

  const rightOffset = WINDOW_RIGHT_BASE + index * (WINDOW_WIDTH + WINDOW_GAP);

  // Cargar mensajes al montar
  useEffect(() => {
    if (loaded.current || !session?.user.accessToken) return;
    loaded.current = true;
    fetchMensajes(convId, session.user.accessToken).then((res) => {
      if (res?.isSuccess) setMensajes(res.data);
    });
    marcarLeidosByConversacion(convId, isCompanyAdmin, session.user.accessToken);
  }, [convId, session, isCompanyAdmin]);

  // Recibir mensajes en tiempo real
  useEffect(() => {
    if (!lastIncomingMessage || lastIncomingMessage.idConversacion !== convId) return;
    setMensajes((prev) => {
      if (prev.some((m) => m.idMensaje === lastIncomingMessage.idMensaje)) return prev;
      return [...prev, lastIncomingMessage];
    });
    setLastIncomingMessage(null);
    if (minimized) {
      setUnreadCount((n) => n + 1);
    } else if (session?.user.accessToken) {
      marcarLeidosByConversacion(convId, isCompanyAdmin, session.user.accessToken);
    }
  }, [lastIncomingMessage, convId, minimized, session, isCompanyAdmin, setLastIncomingMessage]);

  const handleSend = async (contenido: string) => {
    if (!session?.user.accessToken) return;
    const res = await enviarMensaje(
      { idConversacion: convId, esDeEmpresa: isCompanyAdmin, contenido },
      session.user.accessToken,
    );
    if (res?.isSuccess) {
      setMensajes((prev) => {
        if (prev.some((m) => m.idMensaje === res.data.idMensaje)) return prev;
        return [...prev, res.data];
      });
    }
  };

  const handleToggleMinimize = () => {
    const next = !minimized;
    setMinimized(next);
    if (!next && unreadCount > 0 && session?.user.accessToken) {
      setUnreadCount(0);
      marcarLeidosByConversacion(convId, isCompanyAdmin, session.user.accessToken);
    }
  };

  return (
    <div
      className="fixed bottom-0 z-[100] flex flex-col rounded-t-2xl shadow-2xl border border-zinc-200 bg-white overflow-hidden transition-all duration-200"
      style={{ width: WINDOW_WIDTH, right: rightOffset, height: minimized ? "auto" : 480 }}
      role="dialog"
      aria-label={`Chat con ${nombre}`}
    >
      {/* Header — click para minimizar/expandir */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-primary text-white cursor-pointer select-none"
        onClick={handleToggleMinimize}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleToggleMinimize(); }}
        aria-expanded={!minimized}
      >
        <div className="size-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">
          {nombre.charAt(0).toUpperCase()}
        </div>
        <p className="flex-1 font-semibold text-sm truncate min-w-0">{nombre}</p>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-tight shrink-0">
            {unreadCount}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleToggleMinimize(); }}
          aria-label={minimized ? "Expandir chat" : "Minimizar chat"}
          className="p-1 rounded hover:bg-white/20 transition-colors cursor-pointer"
        >
          {minimized ? <ChevronUp className="size-4" /> : <Minus className="size-4" />}
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); closeFloatingChat(convId); }}
          aria-label="Cerrar chat"
          className="p-1 rounded hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </div>

      {!minimized && (
        <>
          <ChatWindow mensajes={mensajes} esEmpresa={isCompanyAdmin} />
          <MessageInput onSend={handleSend} />
        </>
      )}
    </div>
  );
}

/** Renderiza todas las ventanas flotantes activas (máx. 3) */
export default function FloatingChatWindows() {
  const floatingConvs = useAuthStore((s) => s.floatingConvs);
  if (floatingConvs.length === 0) return null;
  return (
    <>
      {floatingConvs.map((conv, index) => (
        <SingleFloatingChat
          key={conv.convId}
          convId={conv.convId}
          nombre={conv.nombre}
          index={index}
        />
      ))}
    </>
  );
}
