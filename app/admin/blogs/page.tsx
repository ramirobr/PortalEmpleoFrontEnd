import { auth } from "@/auth";
import { fetchAllCatalogsByType } from "@/lib/catalog/fetch";
import { getBlogCounters } from "@/lib/admin/adminBlogs";
import { Suspense } from "react";
import AdminBlogsClient from "./components/AdminBlogsClient";

export default async function AdminBlogsPage() {
  const session = await auth();
  const [counters, estados] = await Promise.all([
    getBlogCounters(session?.user.accessToken),
    fetchAllCatalogsByType("ESTADO_BLOG"),
  ]);

  return (
    <Suspense fallback={<div>Cargando blogs…</div>}>
      <AdminBlogsClient counters={counters?.data} estados={estados ?? []} />
    </Suspense>
  );
}
