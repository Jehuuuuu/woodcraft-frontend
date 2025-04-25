"use client"
import { SyncLoader } from 'react-spinners';
import { Suspense } from "react"
import ConfiguratorClient from "@/components/configurator/ConfiguratorClient"
// import { getUser } from "@/utils/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/store/authStore';

export default function ConfiguratorPage() {
  const {user} = useAuthStore();
  const router = useRouter();
  if (!user){
    return (
        <div className="pt-22 px-8 pb-8 flex justify-center container mx-auto bg-[var(--background)] ">
        <Card>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold mb-2">You are not logged in</h2>
              <p className="text-base max-w-150 text-center">Our 3D Product Configurator allows you to customize wooden handicrafts with interactive controls. Please log in to access this feature.</p>
              <div className = "grid grid-cols-2 gap-2">
                <Button className="mt-4 bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors" onClick={() => router.push("/login")}>
                  Login
                </Button>
                <Button className="mt-4 border border-[#8B4513] bg-white text-[#8B4513] hover:bg-[#f0e6d9] transition-colors" onClick={() => router.push("/")}>
                  Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> 
      )
  }
  return (
    // <Suspense fallback={
    //   <div className="flex justify-center items-center h-screen bg-[var(--background)]">
    //     <SyncLoader color="#8B4513" size={12} />
    //   </div>
    // }>
      <ConfiguratorClient />
    // </Suspense>
  );
}
