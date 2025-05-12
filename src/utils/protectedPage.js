"use client"
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
export default function ProtectedPage({ children }) {
  const { user } = useAuthStore();
  const router = useRouter();
  if(!user){
    router.push("/login")
    return null;
  } 
  return children;
}