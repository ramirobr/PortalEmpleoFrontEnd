import { auth } from "@/auth";
import AdminTestimoniosClient from "./components/AdminTestimoniosClient";
import { fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import { getTestimonialCounters } from "@/lib/admin/testimonios";

export default async function AdminTestimoniosPage() {
  const session = await auth();
  const estados = await fetchAllCatalogsByType("ESTADO_APLICACION");
  const counters = await getTestimonialCounters(session?.user.accessToken);

  return <AdminTestimoniosClient estados={estados} counters={counters} />;
}
