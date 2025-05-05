"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from "@/store/authStore";
import ProfileComponent from "@/components/profile/ProfileComponent";

export default function ProfilePage() {
  const { user, isAuthenticated, setCsrfToken } = useAuthStore();
  const router = useRouter();
  const [userDesigns, setUserDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && user === null) {
      router.push('/login');
    } else if (user) {
      fetchUserDesigns();
    }
  }, [isAuthenticated, user, router]);

  const fetchUserDesigns = async () => {
    try {
      setIsLoading(true);
      const csrfToken = await setCsrfToken();
      
      const response = await fetch(`https://woodcraft-backend.onrender.com/api/get_customer_designs?user_id=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setUserDesigns(data);
      } else if (data.success === false) {
        console.error("Failed to fetch designs:", data.message);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching customer designs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return <ProfileComponent userDesigns={userDesigns} isLoading={isLoading} />;
}