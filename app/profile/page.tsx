import { auth } from "@/auth";
import ProfileDashboardContainer from "./components/ProfileDashboardContainer";
import { getDashboardInfoByUserId } from "@/lib/user/info";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) return;
  const { id, accessToken } = session.user;
  const dashboard = await getDashboardInfoByUserId(id, accessToken);
  if (!dashboard) return;

  return <ProfileDashboardContainer initialDashboard={dashboard} />;
}
