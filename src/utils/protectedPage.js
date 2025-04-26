import { getServerSession } from "./authentication";
import { redirect } from "next/navigation";

export default async function ProtectedPage({ children }) {
  const session = await getServerSession();
  
  if(session === null){
    redirect("/login");
  }

  return children;
}