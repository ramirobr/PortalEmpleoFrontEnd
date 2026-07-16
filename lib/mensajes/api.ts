import { fetchApi } from "@/lib/apiClient";
import type { Conversacion, Mensaje, EnviarMensajePayload, GetOrCreateConversacionPayload } from "@/types/mensajes";
import type { GenericResponse } from "@/types/user";

export async function fetchConversacionesByUsuario(idUsuario: string, token: string) {
  return fetchApi<GenericResponse<Conversacion[]>>(`/Conversacion/usuario/${idUsuario}`, { token });
}

export async function fetchConversacionesByEmpresa(idEmpresa: string, token: string) {
  return fetchApi<GenericResponse<Conversacion[]>>(`/Conversacion/empresa/${idEmpresa}`, { token });
}

export async function getOrCreateConversacion(
  payload: GetOrCreateConversacionPayload,
  token: string,
) {
  return fetchApi<GenericResponse<{ idConversacion: string }>>(`/Conversacion/obtener-o-crear`, {
    method: "POST",
    body: payload,
    token,
  });
}

export async function fetchMensajes(idConversacion: string, token: string) {
  return fetchApi<GenericResponse<Mensaje[]>>(`/Mensaje/conversacion/${idConversacion}`, { token });
}

export async function enviarMensaje(payload: EnviarMensajePayload, token: string) {
  return fetchApi<GenericResponse<Mensaje>>(`/Mensaje/enviar`, {
    method: "POST",
    body: payload,
    token,
  });
}

export async function marcarLeidosByConversacion(
  idConversacion: string,
  esEmpresa: boolean,
  token: string,
) {
  return fetchApi(`/Mensaje/marcar-leidos/${idConversacion}?esEmpresa=${esEmpresa}`, {
    method: "PUT",
    token,
  });
}
