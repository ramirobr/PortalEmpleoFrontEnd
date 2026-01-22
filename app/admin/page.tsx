import React from "react";

const AdminDashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder cards for admin stats */}
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold mt-2">1,234</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Jobs</h2>
          <p className="text-3xl font-bold mt-2">567</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Companies</h2>
          <p className="text-3xl font-bold mt-2">89</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Pending Approvals</h2>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
