"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from "@/store/authStore";
import ProfileComponent from "@/components/profile/ProfileComponent";

export default function ProfilePage() {
  const { fetchUserDesigns } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data =  await fetchUserDesigns();
      setData(data);
      setIsLoading(false);
      return data;
    };
    fetchData();
  })
  
  return <ProfileComponent userDesigns={data} isLoading={isLoading} />;
}