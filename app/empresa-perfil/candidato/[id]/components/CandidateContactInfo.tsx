"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/context/authStore";
import { DatosContacto } from "@/types/user";
import { MESSAGING_ENABLED } from "@/lib/utils";
import { getOrCreateConversacion } from "@/lib/mensajes/api";
import { MessageSquare } from "lucide-react";

interface CandidateContactInfoProps {
  datosContacto: DatosContacto;
  candidateId: string;
  nombreCandidato?: string;
}

export default function CandidateContactInfo({
  datosContacto,
  candidateId,
  nombreCandidato,
}: CandidateContactInfoProps) {
  const { data: session } = useSession();
  const idEmpresa = useAuthStore((s) => s.idEmpresa);
  const openFloatingChat = useAuthStore((s) => s.openFloatingChat);
  const [contactando, setContactando] = useState(false);

  const handleSendMessage = async () => {
    if (!session?.user.accessToken || !idEmpresa) return;
    setContactando(true);
    try {
      const res = await getOrCreateConversacion(
        { idUsuario: candidateId, idEmpresa },
        session.user.accessToken,
      );
      if (res?.isSuccess) {
        openFloatingChat(res.data.idConversacion, nombreCandidato ?? datosContacto.email);
      }
    } finally {
      setContactando(false);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <svg
          className="size-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        Información de Contacto
      </h3>

      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <svg
              className="size-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Email
            </p>
            <a
              href={`mailto:${datosContacto.email}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {datosContacto.email}
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <svg
              className="size-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Teléfono
            </p>
            <a
              href={`tel:${datosContacto.telefono}`}
              className="text-sm font-medium text-slate-900 hover:text-primary"
            >
              {datosContacto.telefono}
            </a>
          </div>
        </div>

        {/* Cellphone */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <svg
              className="size-4 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Celular
            </p>
            <a
              href={`tel:${datosContacto.celular}`}
              className="text-sm font-medium text-slate-900 hover:text-primary"
            >
              {datosContacto.celular}
            </a>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-orange-50 rounded-lg">
            <svg
              className="size-4 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Dirección
            </p>
            <p className="text-sm font-medium text-slate-900">
              {datosContacto.direccion}
            </p>
            <p className="text-sm text-slate-500">
              {datosContacto.ciudad}, {datosContacto.provincia},{" "}
              {datosContacto.pais}
            </p>
          </div>
        </div>

        {/* Planilla de servicio básico */}
        {datosContacto.planillaServicio && (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Planilla de servicio básico</p>
              <button type="button" onClick={() => { const d = datosContacto.planillaServicio as string; const ext = d.startsWith("data:application/pdf") ? ".pdf" : ".jpg"; const a = document.createElement("a"); a.href = d; a.download = `planilla_servicio${ext}`; a.click(); }} className="text-sm font-medium text-primary hover:text-primary/80 underline cursor-pointer">Descargar archivo</button>
            </div>
          </div>
        )}

        {/* Antecedentes penales */}
        {datosContacto.documentoAntecedentes && (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Antecedentes penales</p>
              <button type="button" onClick={() => { const a = document.createElement("a"); a.href = datosContacto.documentoAntecedentes!; a.download = "antecedentes_penales.pdf"; a.click(); }} className="text-sm font-medium text-primary hover:text-primary/80 underline cursor-pointer">Descargar documento</button>
            </div>
          </div>
        )}

        {/* Validación IESS */}
        {datosContacto.documentoIESS && (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Validación IESS</p>
              <button type="button" onClick={() => { const a = document.createElement("a"); a.href = datosContacto.documentoIESS!; a.download = "validacion_iess.pdf"; a.click(); }} className="text-sm font-medium text-primary hover:text-primary/80 underline cursor-pointer">Descargar documento</button>
            </div>
          </div>
        )}

        {/* Botón Enviar Mensaje — controlado por feature flag */}
        {MESSAGING_ENABLED && (
          <button
            type="button"
            disabled={contactando}
            onClick={handleSendMessage}
            className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm cursor-pointer"
          >
            <MessageSquare className="size-4" />
            {contactando ? "Iniciando chat…" : "Enviar Mensaje"}
          </button>
        )}
      </div>
    </div>
  );
}
