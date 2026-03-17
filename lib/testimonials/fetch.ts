import { fetchApi } from "../apiClient";
import { TestimonialsResponse } from "@/types/testimonials";
import { GenericResponse } from "@/types/user";
import { UserTestimonial } from "./schema";

export async function fetchTestimonials() {
  const json = await fetchApi<TestimonialsResponse>("/Testimonial/getActive");
  return json?.data;
}

export type CreateTestimonialRequest = {
  idUsuario: string;
  cargo: string;
  empresa: string;
  testimonioDetalle: string;
  calificacion: number;
};

export type CreateTestimonialResponse = GenericResponse<string>;

export async function createTestimonial(
  data: CreateTestimonialRequest,
  token?: string
): Promise<CreateTestimonialResponse | null> {
  const response = await fetchApi<CreateTestimonialResponse>(
    "/Testimonial/create",
    {
      method: "POST",
      body: data,
      token,
    }
  );
  return response;
}

// Request para obtener testimonios del usuario con paginación
export type GetUserTestimonialsRequest = {
  pageSize: number;
  currentPage: number;
  sortBy: string;
  sortDirection: string;
  idUsuario: string;
};

// Respuesta paginada del endpoint
export type GetUserTestimonialsData = {
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  data: UserTestimonial[];
};

export type GetUserTestimonialsResponse = GenericResponse<GetUserTestimonialsData>;

export async function fetchUserTestimonials(
  params: GetUserTestimonialsRequest,
  token?: string
): Promise<GetUserTestimonialsResponse | null> {
  const response = await fetchApi<GetUserTestimonialsResponse>(
    "/Testimonial/getByUser",
    {
      method: "POST",
      body: params,
      token,
    }
  );
  return response;
}

// Request para actualizar testimonio
export type UpdateTestimonialRequest = {
  idTestimonio: string;
  idUsuario: string;
  cargo: string;
  empresa: string;
  testimonioDetalle: string;
  calificacion: number;
};

export type UpdateTestimonialResponse = GenericResponse<string>;

export async function updateTestimonial(
  data: UpdateTestimonialRequest,
  token?: string
): Promise<UpdateTestimonialResponse | null> {
  const response = await fetchApi<UpdateTestimonialResponse>(
    "/Testimonial/update",
    {
      method: "PUT",
      body: data,
      token,
    }
  );
  return response;
}

// Eliminar testimonio
export type DeleteTestimonialResponse = GenericResponse<string>;

export async function deleteTestimonial(
  idTestimonio: string,
  token?: string
): Promise<DeleteTestimonialResponse | null> {
  const response = await fetchApi<DeleteTestimonialResponse>(
    `/Testimonial/delete/${idTestimonio}`,
    {
      method: "DELETE",
      token,
    }
  );
  return response;
}