import { auth } from "@/auth";
import AdminTestimoniosClient from "./components/AdminTestimoniosClient";
import { fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import { getTestimonialCounters } from "@/lib/admin/testimonios";

import { Suspense } from "react";

export default async function AdminTestimoniosPage() {
  const session = await auth();
  const [estados, counters] = await Promise.all([
    fetchAllCatalogsByType("ESTADO_TESTIMONIO"),
    getTestimonialCounters(session?.user.accessToken),
  ]);

  return (
    <Suspense fallback={<div>Cargando testimonios…</div>}>
      <AdminTestimoniosClient estados={estados} counters={counters} />
    </Suspense>
  );
}
