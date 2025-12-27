import Jumbo from "../components/shared/components/Jumbo";
import MainLayout from "@/components/shared/layout/MainLayout";
import Footer from "../components/shared/components/Footer";
import Testimonials from "../components/shared/components/Testimonials";
import RecentJobs from "@/components/shared/components/RecentJobs";
import { fetchTestimonials } from "@/lib/testimonials/fetch";
import { fetchRecentJobs } from "@/lib/jobs/recent";
import { auth } from "@/auth";

export default async function Home() {
  const testimonials = await fetchTestimonials();
  const jobs = await fetchRecentJobs();
  const session = await auth();

  return (
    <MainLayout>
      <Jumbo />
      <RecentJobs jobs={jobs} session={session} />
      <Testimonials testimonials={testimonials} />
      <Footer />
    </MainLayout>
  );
}
