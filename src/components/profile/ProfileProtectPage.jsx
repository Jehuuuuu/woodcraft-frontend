"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import ProfileComponent from "./ProfileComponent";

export default function ProfileProtectPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (hasHydrated && user === null) {
      router.push("/login");
    }
  }, [hasHydrated, user]);

  if (!hasHydrated || user === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--background)]">
        <SyncLoader color="#8B4513" loading={true} size={12} />
      </div>
    );
  }

  return <ProfileComponent />;
}
