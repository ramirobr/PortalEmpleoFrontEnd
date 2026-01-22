import { fetchApi } from "../apiClient";
import { TestimonialsResponse } from "@/types/testimonials";

export async function fetchTestimonials() {
  const json = await fetchApi<TestimonialsResponse>("/Testimonial/getActive");
  return json?.data;
}