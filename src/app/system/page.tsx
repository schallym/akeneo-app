"use client";

import { useRouter } from "next/navigation";
import { CardIcon, SectionTitle } from "akeneo-design-system";

export default function System() {
  const router = useRouter();

  return (
    <div>
      <h1 className="title">System</h1>
      <SectionTitle>
        <h2 className="section-title">General parameters</h2>
      </SectionTitle>
      <p
        className="flex flex-col items-center divide-x divide mt-5 cursor-pointer w-80 bg-white border border-gray-200 md:flex-row md:max-w-xl hover:bg-gray-100"
        onClick={() => router.push("/system/app")}
      >
        <CardIcon color="#e5e7eb" className="min-w-16" />
        <div className="flex flex-col justify-between p-4">
          <p className="card-title">App</p>
          <p className="card-body">Manage your Akeneo App</p>
        </div>
      </p>
    </div>
  );
}
