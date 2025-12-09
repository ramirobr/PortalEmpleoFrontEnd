import { Edit } from "lucide-react";
import Navbar from "../../components/shared/components/Navbar";
import AsideMenu from "./components/AsideMenu";
import JobsApplied from "./components/JobsApplied";
import Dashboard from "./components/Dashboard";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <AsideMenu />
        {/* Main Content */}
        <main className="flex-1 px-10 py-8">
          <Dashboard />
          <JobsApplied />
        </main>
      </div>
    </div>
  );
}
