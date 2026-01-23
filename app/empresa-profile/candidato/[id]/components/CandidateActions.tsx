"use client";

import { useState } from "react";
import {
  CheckIcon,
  XCircleIcon,
} from "@/components/shared/icons/Icons";

interface CandidateActionsProps {
  candidateId: string;
}

export default function CandidateActions({
  candidateId,
}: CandidateActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    // TODO: Implement actual API call
    console.log("Approving candidate:", candidateId);
    setTimeout(() => {
      setIsProcessing(false);
      alert("Candidato aprobado exitosamente");
    }, 1000);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    // TODO: Implement actual API call
    console.log("Rejecting candidate:", candidateId);
    setTimeout(() => {
      setIsProcessing(false);
      alert("Candidato rechazado");
    }, 1000);
  };

  const handleScheduleInterview = () => {
    // TODO: Implement interview scheduling
    console.log("Schedule interview for:", candidateId);
    alert("Función de programar entrevista próximamente");
  };

  const handleSendMessage = () => {
    // TODO: Implement messaging
    console.log("Send message to:", candidateId);
    alert("Función de mensajería próximamente");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>

      <div className="space-y-3">
        {/* Approve Button */}
        <button
          onClick={handleApprove}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <CheckIcon className="w-4 h-4" />
          Aprobar Candidato
        </button>

        {/* Reject Button */}
        <button
          onClick={handleReject}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <XCircleIcon className="w-4 h-4" />
          Rechazar Candidato
        </button>

        {/* Schedule Interview Button */}
        <button
          onClick={handleScheduleInterview}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Programar Entrevista
        </button>

        {/* Send Message Button */}
        <button
          onClick={handleSendMessage}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Enviar Mensaje
        </button>
      </div>

      {/* Additional Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
            title="Añadir a favoritos"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            Guardar
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
            title="Imprimir perfil"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Imprimir
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
            title="Compartir perfil"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Compartir
          </button>
        </div>
      </div>
    </div>
  );
}
