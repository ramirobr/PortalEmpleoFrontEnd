import { auth } from "@/auth";
import Dashboard from "./components/Dashboard";
import JobsApplied from "./components/JobsApplied";
import { getDashboardInfoByUserId } from "@/lib/user/info";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) return;
  const { id, accessToken } = session.user;
  const dashboard = await getDashboardInfoByUserId(id, accessToken);
  if (!dashboard) return;

  return (
    <>
      <Dashboard {...dashboard} />
      <JobsApplied listaTrabajosAplicados={dashboard.listaTrabajosAplicados} />
    </>
  );
}
