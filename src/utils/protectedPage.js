"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { SyncLoader } from "react-spinners"
export default function ProtectedPage({ children }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true); 
  const override = {
    display: "block",
    margin: "0 auto",
  };
  useEffect( () => {
    if (!user) {
        router.push("/login");
    }else{
        setLoading(false)
        
    }
  }, [user, router])
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999] w-screen h-screen">
        <SyncLoader
          color="#8B4513"
          loading={loading}
          cssOverride={override}
          size={12}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }
  return user ? children : null;
}