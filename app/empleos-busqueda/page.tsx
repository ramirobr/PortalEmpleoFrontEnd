import { Filters } from "./components/Filters";
import Footer from "../../components/shared/components/Footer";
// import Navbar from "../../components/shared/components/Navbar"; // Replaced by MainLayout
import MainLayout from "../../components/shared/layout/MainLayout";
import Banner from "../../components/shared/components/Banner";
import Search from "./components/Search";
import { Suspense } from "react";
import { auth } from "@/auth";
import { fetchFilters } from "../../lib/search/getFilters";

type Props = {
  searchParams: Promise<Record<string, string>>;
};

export default async function JobsPage({ searchParams }: Props) {
  const session = await auth();
  const params = await searchParams;
  const filtersItems = await fetchFilters();
  const filters = {
    page: params.page ?? "1",
    pageSize: params.pageSize ?? "10",
    q: params.q,
    fecha: params.fecha,
    modalidad: params.modalidad,
    provincia: params.provincia,
    ciudad: params.ciudad,
    empresa: params.empresa,
    experience: params.experience,
  };

  return (
    <div className="min-h-screen">
      <MainLayout>
        <div className="mx-auto">
          <Banner />
          <section className="container py-12 flex gap-8">
            <Suspense>
              <Filters
                initialFilters={filters as Record<string, string>}
                filters={filtersItems}
              />
              <Search token={session?.user.accessToken} />
            </Suspense>
          </section>
        </div>
        <Footer />
      </MainLayout>
    </div>
  );
}
