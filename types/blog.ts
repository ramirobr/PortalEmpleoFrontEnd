import { GenericResponse } from "./user";

export interface BlogResumen {
  idBlog: string;
  titulo: string;
  slug: string;
  resumen: string;
  imagenUrl?: string;
  fechaPublicacion?: string;
}

export interface Blog extends BlogResumen {
  contenido: string;
  estadoNombre?: string;
}

export type BlogsResponse = GenericResponse<BlogResumen[]>;
export type BlogResponse = GenericResponse<Blog>;

export interface AdminBlog {
  idBlog: string;
  titulo: string;
  slug: string;
  resumen: string;
  contenido: string;
  imagenUrl?: string;
  fechaCreacion: string;
  fechaPublicacion?: string;
  estado: { id: number; nombre: string };
}

export interface AdminBlogsListData {
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  data: AdminBlog[];
}

export type AdminBlogsListResponse = GenericResponse<AdminBlogsListData>;

export interface BlogCounters {
  totalBlogs: number;
  totalBlogsPublicados: number;
  totalBlogsBorrador: number;
  totalBlogsArchivados: number;
}

export type BlogCountersResponse = GenericResponse<BlogCounters>;

export interface AdminBlogsParams {
  pageSize: number;
  currentPage: number;
  sortBy?: string;
  sortDirection?: string;
  search?: string;
  estadoId?: number;
}

export const EstadoBlogNombre = {
  Publicado: "Publicado",
  Borrador: "Borrador",
  Archivado: "Archivado",
} as const;

export type ESTADOS_BLOG = (typeof EstadoBlogNombre)[keyof typeof EstadoBlogNombre];
