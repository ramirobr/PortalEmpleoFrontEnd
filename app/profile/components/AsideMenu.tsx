import { auth } from "@/auth";
import Link from "next/link";

export default async function AsideMenu() {
  //const session = await auth();

  //if (!session?.user) return null;
  return (
    <aside className="sticky top-0 h-screen w-64 bg-white shadow flex flex-col items-center py-8 px-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gray-200 mb-2">
          <img
            src="/profile.jpg"
            alt="Profile"
            width={80}
            height={80}
            className="object-cover w-full h-full rounded-full"
            style={{ display: "block" }}
          />
        </div>
        <div className="font-semibold text-lg focus:outline-blue-500 focus-visible:outline focus-visible:outline-2">
          {/*session.user.fullName*/}
          Juan Anaya
        </div>
        <div className="text-sm text-gray-500">Colombia</div>
        <button className="btn btn-primary mt-4" style={{ outline: "none" }}>
          Ver Perfil
        </button>
      </div>
      <nav className="flex-1 w-full">
        <ul className="space-y-2">
          <li
            id="dashboard"
            className="bg-blue-50 rounded px-3 py-2 font-semibold text-primary flex items-center"
          >
            <Link href="/profile/" className="flex items-center w-full h-full">
              <svg className="h-[37px] w-[20px] mr-2" viewBox="0 0 20 20">
                <path d="M15 2H5L4 3v14l1 1h10l1-1V3l-1-1m0 15H5v-3h2a1 1 0 0 0 2 0 1 1 0 0 0-2-1H5v-3h2a1 1 0 0 0 2 0 1 1 0 0 0-2 0H5V7h2a1 1 0 0 0 2-1 1 1 0 0 0-2 0H5V3h10v14zm-8-3 1-1v1H7m0-4h1-1m0-4h1c1 0 0 0 0 0v1L7 6" />
              </svg>
              <span>Dashboard</span>
            </Link>
          </li>
          <li
            id="perfil"
            className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center"
          >
            <Link
              href="/profile/edit"
              className="flex items-center w-full h-full"
            >
              <svg className="h-[37px] w-[20px] mr-2" viewBox="0 0 20 20">
                <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
              </svg>
              <span>Editar Perfil</span>
            </Link>
          </li>
          <li className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center">
            My Resume
          </li>
          <li className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center">
            My Applied
          </li>
          <li className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center">
            Shortlist Jobs
          </li>
          <li className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center">
            Following Employers
          </li>
          <li className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center">
            Alerts Jobs
          </li>
          <li className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center">
            Messages
          </li>
          <li className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center">
            Meetings
          </li>
          <li className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center">
            Change Password
          </li>
          <li className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center">
            Delete Profile
          </li>
          <li className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center">
            Logout
          </li>
        </ul>
      </nav>
      <div className="mt-8 w-full text-center">
        <div className="text-sm text-gray-600 mb-1">
          Skills Percentage:{" "}
          <span className="text-red-600 font-bold">100%</span>
        </div>
        <div className="w-full h-2 bg-blue-100 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full"
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </aside>
  );
}
