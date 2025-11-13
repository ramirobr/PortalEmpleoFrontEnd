import Navbar from "../shared/components/Navbar";
import user from "../mocks/user.json";

export default function ProfilePage() {
  return (
    <div>
      <Navbar />
      <main className="max-w-xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="bg-white rounded shadow p-6">
          <p className="font-semibold">Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <h2 className="mt-4 text-lg font-bold">Applied Jobs</h2>
          <ul className="list-disc ml-6">
            {user.appliedJobs.map((jobId: string) => (
              <li key={jobId}>{jobId}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
