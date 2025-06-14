"use client";

import ProfileComponent from "@/components/profile/ProfileComponent";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SyncLoader } from "react-spinners";
export default function ProfileProtectPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user]);

  if (user === null)
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--background)]">
        <SyncLoader color="#8B4513" loading={true} size={12} />
      </div>
    );

  return <ProfileComponent />;
}
