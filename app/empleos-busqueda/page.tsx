import { Filters } from "./components/Filters";
import Footer from "../../components/shared/components/Footer";
import Navbar from "../../components/shared/components/Navbar";
import Banner from "../../components/shared/components/Banner";
import Search from "./components/Search";
import { Suspense } from "react";

export default function JobsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto">
        <Banner />
        <section className="container py-12 flex gap-8">
          <Suspense>
            <Filters />
            <Search />
          </Suspense>
        </section>
      </main>
      <Footer />
    </div>
  );
}
