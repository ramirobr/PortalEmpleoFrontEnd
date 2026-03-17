import { TestimonialCountersResponse } from "@/types/testimonials";
import { fetchApi } from "../apiClient";

export const getTestimonialCounters = async (token?: string) => {
  const json = await fetchApi<TestimonialCountersResponse>("/Testimonial/getCounters", {
    token
  });
  return json?.data;
};

export const approveTestimonial = async (idTestimonio: string, token?: string) => {
  const json = await fetchApi(`/Testimonial/approve/${idTestimonio}`, {
    method: "POST",
    token,
  });
  return json;
};

export const rejectTestimonial = async (idTestimonio: string, token?: string) => {
  const json = await fetchApi(`/Testimonial/reject/${idTestimonio}`, {
    method: "POST",
    token,
  });
  return json;
};

export const deleteTestimonial = async (idTestimonio: string, token?: string) => {
  const json = await fetchApi(`/Testimonial/delete/${idTestimonio}`, {
    method: "DELETE",
    token,
  });
  return json;
};
