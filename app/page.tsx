import RecentJobs from "@/components/shared/components/RecentJobs";
import MainLayout from "@/components/shared/layout/MainLayout";
import { fetchRecentJobs } from "@/lib/jobs/recent";
import { fetchTestimonials } from "@/lib/testimonials/fetch";
import Footer from "../components/shared/components/Footer";
import Jumbo from "../components/shared/components/Jumbo";
import Testimonials from "../components/shared/components/Testimonials";

export default async function Home() {
  const testimonials = await fetchTestimonials();
  const jobs = await fetchRecentJobs();

  return (
    <MainLayout>
      <Jumbo />
      <RecentJobs jobs={jobs} />
      <Testimonials testimonials={testimonials} />
      <Footer />
    </MainLayout>
  );
}
