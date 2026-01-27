import { fetchApi } from "@/lib/apiClient";
import {
  AdminTestimonio,
  AdminTestimoniosParams,
  DeleteTestimonioResponse,
  GetAdminTestimoniosResponse,
  UpdateTestimonioStatusResponse,
} from "@/types/admin";

/**
 * Fetch paginated list of testimonios for admin management
 */
export async function getAdminTestimonios(
  params: AdminTestimoniosParams,
  token?: string,
): Promise<GetAdminTestimoniosResponse | null> {
  const queryParams = new URLSearchParams({
    pageSize: params.pageSize.toString(),
    currentPage: params.currentPage.toString(),
    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(params.sortDirection && { sortDirection: params.sortDirection }),
    ...(params.search && { search: params.search }),
    ...(params.estado && { estado: params.estado }),
  });

  return fetchApi<GetAdminTestimoniosResponse>(
    `/Admin/testimonios?${queryParams.toString()}`,
    { token },
  );
}

/**
 * Update testimonio status (approve/reject)
 */
export async function updateTestimonioStatus(
  idTestimonio: string,
  nuevoEstado: number,
  token?: string,
): Promise<UpdateTestimonioStatusResponse | null> {
  return fetchApi<UpdateTestimonioStatusResponse>("/Admin/testimonio/status", {
    method: "PUT",
    token,
    body: { idTestimonio, nuevoEstado },
  });
}

/**
 * Delete a testimonio
 */
export async function deleteTestimonio(
  idTestimonio: string,
  token?: string,
): Promise<DeleteTestimonioResponse | null> {
  return fetchApi<DeleteTestimonioResponse>(
    `/Admin/testimonio/${idTestimonio}`,
    {
      method: "DELETE",
      token,
    },
  );
}

/**
 * Mock data for development when API is not available
 */
export const mockTestimonios: AdminTestimonio[] = [
  {
    idTestimonio: "t1",
    candidato: {
      idUsuario: "u1",
      nombreCompleto: "María García López",
      email: "maria.garcia@email.com",
      fotoUrl: "/testimonials/1.jpeg",
    },
    cargo: "Desarrolladora Senior",
    empresa: "TechCorp Ecuador",
    testimonioDetalle:
      "Gracias a PortalEmpleo encontré el trabajo de mis sueños en menos de dos semanas. La plataforma es muy intuitiva y las ofertas laborales son de calidad. ¡Altamente recomendado!",
    fechaCreacion: "2024-01-15",
    calificacion: 5,
    estado: { id: 1, nombre: "Aprobado" },
  },
  {
    idTestimonio: "t2",
    candidato: {
      idUsuario: "u2",
      nombreCompleto: "Carlos Rodríguez Muñoz",
      email: "carlos.rodriguez@email.com",
      fotoUrl: "/testimonials/2.jpeg",
    },
    cargo: "Analista de Datos",
    empresa: "DataInsights S.A.",
    testimonioDetalle:
      "Excelente plataforma para buscar empleo. El proceso de aplicación es muy sencillo y recibí varias ofertas en poco tiempo. La comunicación con las empresas fue muy fluida.",
    fechaCreacion: "2024-01-20",
    calificacion: 5,
    estado: { id: 2, nombre: "Pendiente" },
  },
  {
    idTestimonio: "t3",
    candidato: {
      idUsuario: "u3",
      nombreCompleto: "Ana Martínez Vega",
      email: "ana.martinez@email.com",
      fotoUrl: "/testimonials/3.jpeg",
    },
    cargo: "Diseñadora UX/UI",
    empresa: "Creative Studio",
    testimonioDetalle:
      "PortalEmpleo me ayudó a dar un giro en mi carrera profesional. Encontré oportunidades que no había visto en otras plataformas. El soporte al usuario también es muy bueno.",
    fechaCreacion: "2024-02-05",
    calificacion: 4,
    estado: { id: 1, nombre: "Aprobado" },
  },
  {
    idTestimonio: "t4",
    candidato: {
      idUsuario: "u4",
      nombreCompleto: "Pedro Sánchez Torres",
      email: "pedro.sanchez@email.com",
      fotoUrl: undefined,
    },
    cargo: "Project Manager",
    empresa: "Consulting Group",
    testimonioDetalle:
      "Mi experiencia con PortalEmpleo ha sido muy positiva. Las empresas son verificadas y las ofertas son reales. Conseguí mi trabajo actual gracias a esta plataforma.",
    fechaCreacion: "2024-02-10",
    calificacion: 5,
    estado: { id: 2, nombre: "Pendiente" },
  },
  {
    idTestimonio: "t5",
    candidato: {
      idUsuario: "u5",
      nombreCompleto: "Laura Fernández Castro",
      email: "laura.fernandez@email.com",
      fotoUrl: "/testimonials/4.jpeg",
    },
    cargo: "Contadora",
    empresa: "Grupo Financiero ABC",
    testimonioDetalle:
      "Después de meses buscando trabajo, PortalEmpleo fue la solución. La interfaz es clara y permite filtrar las ofertas de manera eficiente. Muy satisfecha con el servicio.",
    fechaCreacion: "2024-02-15",
    calificacion: 4,
    estado: { id: 1, nombre: "Aprobado" },
  },
  {
    idTestimonio: "t6",
    candidato: {
      idUsuario: "u6",
      nombreCompleto: "Diego López Herrera",
      email: "diego.lopez@email.com",
      fotoUrl: undefined,
    },
    cargo: "Ingeniero Civil",
    empresa: "Constructora Nacional",
    testimonioDetalle:
      "Buen sitio, aunque creo que podrían mejorar algunas funcionalidades. De todas formas, encontré varias oportunidades interesantes en mi área.",
    fechaCreacion: "2024-02-20",
    calificacion: 3,
    estado: { id: 3, nombre: "Rechazado" },
  },
  {
    idTestimonio: "t7",
    candidato: {
      idUsuario: "u7",
      nombreCompleto: "Sofía Ruiz Mendoza",
      email: "sofia.ruiz@email.com",
      fotoUrl: "/testimonials/5.jpeg",
    },
    cargo: "Marketing Digital",
    empresa: "Agency Pro",
    testimonioDetalle:
      "¡Increíble plataforma! En solo una semana tuve tres entrevistas programadas. El proceso de postulación es muy rápido y las notificaciones llegan a tiempo.",
    fechaCreacion: "2024-03-01",
    calificacion: 5,
    estado: { id: 2, nombre: "Pendiente" },
  },
  {
    idTestimonio: "t8",
    candidato: {
      idUsuario: "u8",
      nombreCompleto: "Roberto Gómez Pineda",
      email: "roberto.gomez@email.com",
      fotoUrl: undefined,
    },
    cargo: "Desarrollador Backend",
    empresa: "Software Solutions",
    testimonioDetalle:
      "La plataforma tiene muy buenas ofertas para el sector tecnológico. Me gustó la opción de guardar búsquedas y recibir alertas por email.",
    fechaCreacion: "2024-03-05",
    calificacion: 4,
    estado: { id: 1, nombre: "Aprobado" },
  },
  {
    idTestimonio: "t9",
    candidato: {
      idUsuario: "u9",
      nombreCompleto: "Valentina Cruz Lima",
      email: "valentina.cruz@email.com",
      fotoUrl: "/testimonials/6.jpeg",
    },
    cargo: "Asistente Administrativo",
    empresa: "Empresa Comercial",
    testimonioDetalle:
      "Muy contenta con los resultados. La atención al cliente fue excelente cuando tuve dudas sobre cómo usar la plataforma.",
    fechaCreacion: "2024-03-10",
    calificacion: 5,
    estado: { id: 1, nombre: "Aprobado" },
  },
  {
    idTestimonio: "t10",
    candidato: {
      idUsuario: "u10",
      nombreCompleto: "Fernando Ortiz Silva",
      email: "fernando.ortiz@email.com",
      fotoUrl: undefined,
    },
    cargo: "Vendedor Senior",
    empresa: "Retail Express",
    testimonioDetalle:
      "Portal de empleo confiable. Las ofertas son actualizadas constantemente y hay variedad para todos los niveles de experiencia.",
    fechaCreacion: "2024-03-15",
    calificacion: 4,
    estado: { id: 2, nombre: "Pendiente" },
  },
];
