import { fetchApi } from "@/lib/apiClient";
import {
  CarpetaFormValues,
  GetTiposArchivoResponse,
  GetCarpetasEmpresaResponse,
  GetCarpetasUsuarioResponse,
  GetArchivosEmpresaResponse,
  GetArchivosUsuarioResponse,
  GetArchivoDetalleEmpresaResponse,
  GetArchivoDetalleUsuarioResponse,
  ArchivoActionResponse,
} from "@/types/admin";

// ── Tipos de archivo ──────────────────────────────────────────────────────────

export async function getTiposArchivo(
  token?: string,
): Promise<GetTiposArchivoResponse | null> {
  return fetchApi<GetTiposArchivoResponse>("/Archivos/tipos-archivo", {
    token,
  });
}

// ── Carpetas empresa ──────────────────────────────────────────────────────────

export async function getCarpetasEmpresa(
  idEmpresa: string,
  token?: string,
): Promise<GetCarpetasEmpresaResponse | null> {
  return fetchApi<GetCarpetasEmpresaResponse>(
    `/Archivos/carpetas-empresa/${idEmpresa}`,
    { token },
  );
}

export async function createCarpetaEmpresa(
  idEmpresa: string,
  data: CarpetaFormValues,
  token?: string,
): Promise<ArchivoActionResponse | null> {
  return fetchApi<ArchivoActionResponse>("/Archivos/carpetas-empresa", {
    method: "POST",
    token,
    body: {
      IdEmpresa: idEmpresa,
      NombreCarpeta: data.nombreCarpeta,
      Descripcion: data.descripcion,
      IdCarpetaPadre: data.idCarpetaPadre,
    },
  });
}

export async function updateCarpetaEmpresa(
  idCarpetaEmpresa: string,
  data: CarpetaFormValues,
  token?: string,
): Promise<ArchivoActionResponse | null> {
  return fetchApi<ArchivoActionResponse>(
    `/Archivos/carpetas-empresa/${idCarpetaEmpresa}`,
    {
      method: "PUT",
      token,
      body: {
        NombreCarpeta: data.nombreCarpeta,
        Descripcion: data.descripcion,
      },
    },
  );
}

export async function deleteCarpetaEmpresa(
  idCarpetaEmpresa: string,
  token?: string,
): Promise<ArchivoActionResponse | null> {
  return fetchApi<ArchivoActionResponse>(
    `/Archivos/carpetas-empresa/${idCarpetaEmpresa}`,
    { method: "DELETE", token },
  );
}

// ── Archivos empresa ──────────────────────────────────────────────────────────

export async function getArchivosEmpresa(
  idEmpresa: string,
  idCarpetaEmpresa?: string | null,
  token?: string,
): Promise<GetArchivosEmpresaResponse | null> {
  const url = idCarpetaEmpresa
    ? `/Archivos/archivos-empresa/${idEmpresa}?idCarpetaEmpresa=${idCarpetaEmpresa}`
    : `/Archivos/archivos-empresa/${idEmpresa}`;
  return fetchApi<GetArchivosEmpresaResponse>(url, { token });
}

export async function getArchivoDetalleEmpresa(
  idArchivoEmpresa: string,
  token?: string,
): Promise<GetArchivoDetalleEmpresaResponse | null> {
  return fetchApi<GetArchivoDetalleEmpresaResponse>(
    `/Archivos/archivos-empresa/detalle/${idArchivoEmpresa}`,
    { token },
  );
}

export async function uploadArchivoEmpresa(
  idEmpresa: string,
  data: {
    idTipoArchivo: number;
    nombreArchivo: string;
    extension?: string;
    contentType?: string;
    idCarpetaEmpresa?: string;
    archivoBase64: string;
  },
  token?: string,
): Promise<ArchivoActionResponse | null> {
  return fetchApi<ArchivoActionResponse>("/Archivos/archivos-empresa/upload", {
    method: "POST",
    token,
    body: {
      IdEmpresa: idEmpresa,
      IdCarpetaEmpresa: data.idCarpetaEmpresa,
      IdTipoArchivo: data.idTipoArchivo,
      NombreArchivo: data.nombreArchivo,
      Extension: data.extension,
      ContentType: data.contentType,
      ArchivoBase64: data.archivoBase64,
    },
  });
}

export async function deleteArchivoEmpresa(
  idArchivoEmpresa: string,
  token?: string,
): Promise<ArchivoActionResponse | null> {
  return fetchApi<ArchivoActionResponse>(
    `/Archivos/archivos-empresa/${idArchivoEmpresa}`,
    { method: "DELETE", token },
  );
}

export async function moverArchivoEmpresa(
  idArchivoEmpresa: string,
  idCarpetaDestino: string | null,
  token?: string,
): Promise<ArchivoActionResponse | null> {
  return fetchApi<ArchivoActionResponse>(
    `/Archivos/archivos-empresa/${idArchivoEmpresa}/mover`,
    {
      method: "PATCH",
      token,
      body: { IdCarpetaDestino: idCarpetaDestino },
    },
  );
}

// ── Carpetas usuario ──────────────────────────────────────────────────────────

export async function getCarpetasUsuario(
  idUsuario: string,
  token?: string,
): Promise<GetCarpetasUsuarioResponse | null> {
  return fetchApi<GetCarpetasUsuarioResponse>(
    `/Archivos/carpetas-usuario/${idUsuario}`,
    { token },
  );
}

export async function createCarpetaUsuario(
  idUsuario: string,
  data: CarpetaFormValues,
  token?: string,
): Promise<ArchivoActionResponse | null> {
  return fetchApi<ArchivoActionResponse>("/Archivos/carpetas-usuario", {
    method: "POST",
    token,
    body: {
      IdUsuario: idUsuario,
      NombreCarpeta: data.nombreCarpeta,
      Descripcion: data.descripcion,
      IdCarpetaPadre: data.idCarpetaPadre,
    },
  });
}

export async function updateCarpetaUsuario(
  idCarpetaUsuario: string,
  data: CarpetaFormValues,
  token?: string,
): Promise<ArchivoActionResponse | null> {
  return fetchApi<ArchivoActionResponse>(
    `/Archivos/carpetas-usuario/${idCarpetaUsuario}`,
    {
      method: "PUT",
      token,
      body: {
        NombreCarpeta: data.nombreCarpeta,
        Descripcion: data.descripcion,
      },
    },
  );
}

export async function deleteCarpetaUsuario(
  idCarpetaUsuario: string,
  token?: string,
): Promise<ArchivoActionResponse | null> {
  return fetchApi<ArchivoActionResponse>(
    `/Archivos/carpetas-usuario/${idCarpetaUsuario}`,
    { method: "DELETE", token },
  );
}

// ── Archivos usuario ──────────────────────────────────────────────────────────

export async function getArchivosUsuario(
  idUsuario: string,
  idCarpetaUsuario?: string | null,
  token?: string,
): Promise<GetArchivosUsuarioResponse | null> {
  const url = idCarpetaUsuario
    ? `/Archivos/archivos-usuario/${idUsuario}?idCarpetaUsuario=${idCarpetaUsuario}`
    : `/Archivos/archivos-usuario/${idUsuario}`;
  return fetchApi<GetArchivosUsuarioResponse>(url, { token });
}

export async function getArchivoDetalleUsuario(
  idArchivoUsuario: string,
  token?: string,
): Promise<GetArchivoDetalleUsuarioResponse | null> {
  return fetchApi<GetArchivoDetalleUsuarioResponse>(
    `/Archivos/archivos-usuario/detalle/${idArchivoUsuario}`,
    { token },
  );
}

export async function uploadArchivoUsuario(
  idUsuario: string,
  data: {
    idTipoArchivo: number;
    nombreArchivo: string;
    extension?: string;
    contentType?: string;
    idCarpetaUsuario?: string;
    archivoBase64: string;
  },
  token?: string,
): Promise<ArchivoActionResponse | null> {
  return fetchApi<ArchivoActionResponse>("/Archivos/archivos-usuario/upload", {
    method: "POST",
    token,
    body: {
      IdUsuario: idUsuario,
      IdCarpetaUsuario: data.idCarpetaUsuario,
      IdTipoArchivo: data.idTipoArchivo,
      NombreArchivo: data.nombreArchivo,
      Extension: data.extension,
      ContentType: data.contentType,
      ArchivoBase64: data.archivoBase64,
    },
  });
}

export async function deleteArchivoUsuario(
  idArchivoUsuario: string,
  token?: string,
): Promise<ArchivoActionResponse | null> {
  return fetchApi<ArchivoActionResponse>(
    `/Archivos/archivos-usuario/${idArchivoUsuario}`,
    { method: "DELETE", token },
  );
}

export async function moverArchivoUsuario(
  idArchivoUsuario: string,
  idCarpetaDestino: string | null,
  token?: string,
): Promise<ArchivoActionResponse | null> {
  return fetchApi<ArchivoActionResponse>(
    `/Archivos/archivos-usuario/${idArchivoUsuario}/mover`,
    {
      method: "PATCH",
      token,
      body: { IdCarpetaDestino: idCarpetaDestino },
    },
  );
}

// ── Utilidad: descarga desde base64 ──────────────────────────────────────────

export function downloadFileFromBase64(
  base64: string,
  filename: string,
  contentType?: string,
) {
  const byteChars = atob(base64);
  const byteArray = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteArray[i] = byteChars.charCodeAt(i);
  }
  const blob = new Blob([byteArray], {
    type: contentType || "application/octet-stream",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
