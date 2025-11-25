import React from "react";

export default function EditProfile() {
  return (
    <section className="bg-white rounded-lg shadow p-8 max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">Edit Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Profile Image and Upload */}
        <div className="flex flex-col items-center gap-2">
          <img
            src="/profile.jpg"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
          <button className="px-4 py-1 bg-blue-100 text-blue-700 rounded font-semibold text-sm">
            Browse
          </button>
        </div>
        <div />
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <label className="font-semibold text-gray-700">Full Name</label>
          <input
            className="bg-gray-50 rounded px-4 py-2"
            defaultValue="Candidate"
          />

          <label className="font-semibold text-gray-700">Gender</label>
          <input className="bg-gray-50 rounded px-4 py-2" defaultValue="Male" />

          <label className="font-semibold text-gray-700">Phone Number</label>
          <input
            className="bg-gray-50 rounded px-4 py-2"
            defaultValue="123456789"
          />

          <label className="font-semibold text-gray-700">Qualification</label>
          <input
            className="bg-gray-50 rounded px-4 py-2"
            defaultValue="Associate Degree"
          />

          <label className="font-semibold text-gray-700">Languages</label>
          <input
            className="bg-gray-50 rounded px-4 py-2"
            defaultValue="French"
          />

          <label className="font-semibold text-gray-700">Salary ($)</label>
          <input className="bg-gray-50 rounded px-4 py-2" defaultValue="10" />

          <label className="font-semibold text-gray-700">Show my profile</label>
          <select className="bg-gray-50 rounded px-4 py-2">
            <option>Show</option>
            <option>Hide</option>
          </select>

          <label className="font-semibold text-gray-700">Job Title</label>
          <input
            className="bg-gray-50 rounded px-4 py-2"
            defaultValue="UI Designer"
          />
        </div>
        <div className="flex flex-col gap-4">
          <label className="font-semibold text-gray-700">Date of Birth</label>
          <input
            className="bg-gray-50 rounded px-4 py-2"
            defaultValue="04/06/1988"
          />

          <label className="font-semibold text-gray-700">Age</label>
          <input
            className="bg-gray-50 rounded px-4 py-2"
            defaultValue="25-30"
          />

          <label className="font-semibold text-gray-700">Email</label>
          <input
            className="bg-gray-50 rounded px-4 py-2"
            defaultValue="candidate@qaps.com"
          />

          <label className="font-semibold text-gray-700">Experience Time</label>
          <input
            className="bg-gray-50 rounded px-4 py-2"
            defaultValue="2 Year"
          />

          <label className="font-semibold text-gray-700">Salary Type</label>
          <input
            className="bg-gray-50 rounded px-4 py-2"
            defaultValue="Hourly"
          />

          <label className="font-semibold text-gray-700">Categories</label>
          <input
            className="bg-gray-50 rounded px-4 py-2"
            defaultValue="Application"
          />
        </div>
      </form>
      <div className="mt-8">
        <label className="font-semibold text-gray-700 mb-2 block">
          Description
        </label>
        <textarea
          className="bg-gray-50 rounded px-4 py-2 w-full h-24"
          defaultValue={`Hello my name is Nicole Wells and web developer from Portland. In pharetra orci dignissim, blandit mi semper, ultricies diam. Suspendisse malesuada suscipit nunc non volutpat. Sed porta nulla id orci laoreet tempor non consequat enim. Sed vitae aliquam velit. Aliquam ante erat, blandit at pretium eu, accumsan ac est. Integer vehicula rhoncus molestie. Morbi ornare ipsum sed sem condimentum, et pulvinar tortor luctus. Suspendisse condimentum lorem et elementum aliquam.\n\nMauris nec erat ut libero vulputate pulvinar. Aliquam ante erat, blandit at pretium eu, accumsan ac est. Integer vehicula rhoncus molestie. Morbi ornare ipsum sed sem condimentum, et pulvinar tortor luctus. Suspendisse condimentum lorem et elementum aliquam. Mauris nec erat ut libero vulputate pulvinar.`}
        />
      </div>
    </section>
  );
}
