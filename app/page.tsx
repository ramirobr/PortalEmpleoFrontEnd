import Jumbo from "./shared/components/Jumbo";
import RecentJobs from "./shared/components/RecentJobs";
import Navbar from "./shared/components/Navbar";
import Footer from "./shared/components/Footer";
import Testimonials from "./shared/components/Testimonials";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="">
        <Jumbo />
        <RecentJobs />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
