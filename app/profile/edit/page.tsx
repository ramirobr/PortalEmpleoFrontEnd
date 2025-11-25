import EditProfile from "../components/EditProfile";
import Navbar from "../../../components/shared/components/Navbar";
import AsideMenu from "../components/AsideMenu";

export default function EditProfilePage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <Navbar />
      <div className="flex">
        <AsideMenu />
        <main className="flex-1 px-10 py-8">
          <EditProfile />
        </main>
      </div>
    </div>
  );
}
