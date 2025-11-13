import React from "react";

interface JobSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function JobSection({ title, children }: JobSectionProps) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-2 rounded-tr-md rounded-tl-md p-4 mb-4 bg-arsenic text-white !mb-0">
        {title}
      </h2>
      <div className="border border-gray-light rounded-br-md rounded-bl-md p-8 border-t-0">
        {children}
      </div>
    </section>
  );
}
