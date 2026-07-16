"use client";
import { useState } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSend: (contenido: string) => Promise<void>;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try {
      await onSend(trimmed);
      setValue("");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-zinc-100 p-3 flex gap-2 items-end bg-white"
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe un mensaje… (Enter para enviar, Shift+Enter para nueva línea)"
        rows={1}
        disabled={disabled || sending}
        aria-label="Escribir mensaje"
        className="flex-1 resize-none rounded-xl border border-zinc-200 px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-50 max-h-32"
      />
      <button
        type="submit"
        disabled={!value.trim() || sending || disabled}
        aria-label="Enviar mensaje"
        className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
      >
        <Send className="size-4" />
      </button>
    </form>
  );
}
