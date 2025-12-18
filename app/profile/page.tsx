import Navbar from "../../components/shared/components/Navbar";
import AsideMenu from "./components/AsideMenu";
import JobsApplied from "./components/JobsApplied";
import Dashboard from "./components/Dashboard";
import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <Navbar />
      <div className="flex">
        <AsideMenu session={session}/>
        <main className="flex-1 px-10 py-8">
          <Dashboard />
          <JobsApplied />
        </main>
      </div>
    </div>
  );
}
