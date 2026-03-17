import { auth } from "@/auth";
import ProfileDashboardContainer from "./components/ProfileDashboardContainer";
import {
  getDashboardInfoByUserId,
  getUserPic,
  getUserInfoByUserId,
} from "@/lib/user/info";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) return;
  const { id, accessToken } = session.user;
  const dashboard = await getDashboardInfoByUserId(id, accessToken);
  if (!dashboard) return;

  const userPic = await getUserPic(session.user);
  const userInfo = await getUserInfoByUserId(session.user);

  // Derive professional title from summary or first experience if possible
  const profession =
    userInfo?.resumen ||
    userInfo?.experienciaLaboral?.[0]?.puesto ||
    dashboard.resumenProfesional;
  const fullName = userInfo
    ? `${userInfo.datosPersonales.nombre} ${userInfo.datosPersonales.apellido}`
    : dashboard.userName;

  return (
    <ProfileDashboardContainer
      initialDashboard={dashboard}
      userPic={userPic}
      userName={fullName}
      resumenProfesional={profession}
    />
  );
}
