"use client";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { Conversacion } from "@/types/mensajes";
import { parseBackendDate } from "@/lib/utils";

interface ConversacionListProps {
  conversaciones: Conversacion[];
  selectedId?: string;
  esEmpresa: boolean;
  onSelect: (conv: Conversacion) => void;
}

export default function ConversacionList({
  conversaciones,
  selectedId,
  esEmpresa,
  onSelect,
}: ConversacionListProps) {
  if (conversaciones.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm italic">
        No tienes conversaciones aún.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100">
      {conversaciones.map((conv) => {
        const nombre = esEmpresa ? conv.nombreUsuario : conv.nombreEmpresa;
        const timeAgo = formatDistanceToNow(parseBackendDate(conv.fechaUltimoMensaje), {
          addSuffix: true,
          locale: es,
        });
        return (
          <li key={conv.idConversacion}>
            <button
              type="button"
              onClick={() => onSelect(conv)}
              className={`w-full text-left px-4 py-3 hover:bg-zinc-50 transition-colors ${
                selectedId === conv.idConversacion
                  ? "bg-primary/5 border-l-2 border-primary"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-sm text-slate-900 truncate">
                  {nombre ?? "—"}
                </span>
                {conv.mensajesNoLeidos > 0 && (
                  <span className="shrink-0 bg-primary text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-tight">
                    {conv.mensajesNoLeidos}
                  </span>
                )}
              </div>
              {conv.tituloVacante && (
                <p className="text-xs text-primary/70 truncate mt-0.5">
                  {conv.tituloVacante}
                </p>
              )}
              {conv.ultimoMensaje && (
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {conv.ultimoMensaje}
                </p>
              )}
              <p
                className="text-[10px] text-slate-400 mt-1"
                suppressHydrationWarning
              >
                {timeAgo}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
