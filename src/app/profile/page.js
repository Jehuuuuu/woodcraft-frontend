"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from "@/store/authStore";
import ProfileComponent from "@/components/profile/ProfileComponent";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && user === null) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <ProfileComponent />;
}