"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/context/authStore";
import { MESSAGING_ENABLED } from "@/lib/utils";
import {
  fetchConversacionesByEmpresa,
  fetchMensajes,
  enviarMensaje,
  marcarLeidosByConversacion,
} from "@/lib/mensajes/api";
import ConversacionList from "@/components/mensajes/ConversacionList";
import ChatWindow from "@/components/mensajes/ChatWindow";
import MessageInput from "@/components/mensajes/MessageInput";
import type { Conversacion, Mensaje } from "@/types/mensajes";
import { MessageSquare } from "lucide-react";

export default function MensajesEmpresaPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const idEmpresa = useAuthStore((s) => s.idEmpresa);
  const setUnreadMessages = useAuthStore((s) => s.setUnreadMessages);
  const lastIncomingMessage = useAuthStore((s) => s.lastIncomingMessage);
  const setLastIncomingMessage = useAuthStore((s) => s.setLastIncomingMessage);

  // Redirigir si la funcionalidad de mensajería está desactivada
  useEffect(() => {
    if (!MESSAGING_ENABLED) router.replace("/empresa-perfil");
  }, [router]);

  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversacion | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idEmpresa || !session?.user.accessToken) return;
    fetchConversacionesByEmpresa(idEmpresa, session.user.accessToken).then((res) => {
      if (res?.isSuccess) {
        setConversaciones(res.data);
        const total = res.data.reduce((s, c) => s + c.mensajesNoLeidos, 0);
        setUnreadMessages(total);
      }
      setLoading(false);
    });
  }, [idEmpresa, session, setUnreadMessages]);

  // Recibir mensajes en tiempo real via Zustand (alimentado por NotificationRealtimeClient)
  useEffect(() => {
    if (!lastIncomingMessage) return;
    if (selectedConv && lastIncomingMessage.idConversacion === selectedConv.idConversacion) {
      setMensajes((prev) => {
        if (prev.some((m) => m.idMensaje === lastIncomingMessage.idMensaje)) return prev;
        return [...prev, lastIncomingMessage];
      });
    }
    setConversaciones((prev) =>
      prev.map((c) =>
        c.idConversacion === lastIncomingMessage.idConversacion
          ? {
              ...c,
              ultimoMensaje: lastIncomingMessage.contenido,
              fechaUltimoMensaje: lastIncomingMessage.fechaEnvio,
              mensajesNoLeidos:
                selectedConv?.idConversacion === lastIncomingMessage.idConversacion
                  ? c.mensajesNoLeidos
                  : c.mensajesNoLeidos + 1,
            }
          : c,
      ),
    );
    setLastIncomingMessage(null);
  }, [lastIncomingMessage, selectedConv, setLastIncomingMessage]);

  const handleSelectConv = useCallback(
    async (conv: Conversacion) => {
      setSelectedConv(conv);
      setMensajes([]);
      if (!session?.user.accessToken) return;
      const res = await fetchMensajes(conv.idConversacion, session.user.accessToken);
      if (res?.isSuccess) setMensajes(res.data);
      await marcarLeidosByConversacion(conv.idConversacion, true, session.user.accessToken);
      setConversaciones((prev) =>
        prev.map((c) =>
          c.idConversacion === conv.idConversacion ? { ...c, mensajesNoLeidos: 0 } : c,
        ),
      );
    },
    [session],
  );

  const handleSend = async (contenido: string) => {
    if (!selectedConv || !session?.user.accessToken) return;
    const res = await enviarMensaje(
      { idConversacion: selectedConv.idConversacion, esDeEmpresa: true, contenido },
      session.user.accessToken,
    );
    if (res?.isSuccess) {
      setMensajes((prev) => [...prev, res.data]);
      setConversaciones((prev) =>
        prev.map((c) =>
          c.idConversacion === selectedConv.idConversacion
            ? { ...c, ultimoMensaje: contenido, fechaUltimoMensaje: new Date().toISOString() }
            : c,
        ),
      );
    }
  };

  if (!MESSAGING_ENABLED) return null;

  if (loading) {
    return <div className="p-8 text-slate-400 text-sm">Cargando mensajes…</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-primary flex items-center gap-2">
        <MessageSquare className="size-6" />
        Mensajes
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 flex overflow-hidden min-h-[600px]">
        {/* Sidebar — lista de conversaciones */}
        <div className="w-72 border-r border-zinc-100 flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-zinc-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Conversaciones
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ConversacionList
              conversaciones={conversaciones}
              selectedId={selectedConv?.idConversacion}
              esEmpresa={true}
              onSelect={handleSelectConv}
            />
          </div>
        </div>

        {/* Área de chat */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              <div className="px-5 py-3 border-b border-zinc-100">
                <p className="font-semibold text-slate-800">{selectedConv.nombreUsuario}</p>
                {selectedConv.tituloVacante && (
                  <p className="text-xs text-primary/70">{selectedConv.tituloVacante}</p>
                )}
              </div>
              <ChatWindow mensajes={mensajes} esEmpresa={true} />
              <MessageInput onSend={handleSend} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic">
              Selecciona una conversación para comenzar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
