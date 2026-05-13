import { fetchApi } from "@/lib/apiClient";
import {
  AdminBlogsListResponse,
  AdminBlogsParams,
  BlogCountersResponse,
} from "@/types/blog";
import { GenericResponse } from "@/types/user";

export async function getAdminBlogs(
  params: AdminBlogsParams,
  token?: string,
): Promise<AdminBlogsListResponse | null> {
  return fetchApi<AdminBlogsListResponse>("/Blog/admin/getAll", {
    method: "POST",
    token,
    body: {
      pageSize: params.pageSize,
      currentPage: params.currentPage,
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortDirection && { sortDirection: params.sortDirection }),
      ...(params.search && { searchTerm: params.search }),
      ...(params.estadoId && { estadoId: params.estadoId }),
    },
  });
}

export async function createBlog(
  data: {
    titulo: string;
    slug: string;
    resumen: string;
    contenido: string;
    imagenUrl?: string;
    publicarInmediatamente: boolean;
  },
  token?: string,
): Promise<GenericResponse<string> | null> {
  return fetchApi<GenericResponse<string>>("/Blog/create", {
    method: "POST",
    token,
    body: data,
  });
}

export async function updateBlog(
  data: {
    idBlog: string;
    titulo: string;
    slug: string;
    resumen: string;
    contenido: string;
    imagenUrl?: string;
    idEstadoBlog?: number;
  },
  token?: string,
): Promise<GenericResponse<string> | null> {
  return fetchApi<GenericResponse<string>>("/Blog/update", {
    method: "PUT",
    token,
    body: data,
  });
}

export async function deleteBlog(
  idBlog: string,
  token?: string,
): Promise<GenericResponse<string> | null> {
  return fetchApi<GenericResponse<string>>(`/Blog/delete/${idBlog}`, {
    method: "DELETE",
    token,
  });
}

export async function updateBlogStatus(
  idBlog: string,
  nuevoEstado: number,
  token?: string,
): Promise<GenericResponse<string> | null> {
  return fetchApi<GenericResponse<string>>("/Blog/status", {
    method: "PUT",
    token,
    body: { idBlog, nuevoEstado },
  });
}

export async function getBlogCounters(
  token?: string,
): Promise<BlogCountersResponse | null> {
  return fetchApi<BlogCountersResponse>("/Blog/counters", { token });
}
