"use client";
import { useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { Mensaje } from "@/types/mensajes";
import { parseBackendDate } from "@/lib/utils";

interface ChatWindowProps {
  mensajes: Mensaje[];
  /** true = la vista pertenece a la empresa (sus mensajes van a la derecha) */
  esEmpresa: boolean;
}

export default function ChatWindow({ mensajes, esEmpresa }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  if (mensajes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic p-8">
        Inicia la conversación enviando un mensaje.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {mensajes.map((msg) => {
        const esMio = esEmpresa ? msg.esDeEmpresa : !msg.esDeEmpresa;
        const timeAgo = formatDistanceToNow(parseBackendDate(msg.fechaEnvio), {
          addSuffix: true,
          locale: es,
        });
        return (
          <div
            key={msg.idMensaje}
            className={`flex ${esMio ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                esMio
                  ? "bg-primary text-white rounded-br-sm"
                  : "bg-zinc-100 text-slate-800 rounded-bl-sm"
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap break-words">
                {msg.contenido}
              </p>
              <p
                className={`text-[10px] mt-1 ${
                  esMio ? "text-white/60 text-right" : "text-slate-400"
                }`}
                suppressHydrationWarning
              >
                {timeAgo}
                {esMio && (
                  <span className="ml-1">{msg.esLeido ? "✓✓" : "✓"}</span>
                )}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
