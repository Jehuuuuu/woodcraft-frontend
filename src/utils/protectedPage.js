import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export default async function ProtectedPage({ children }) {
  const cookieStore = cookies()
  const session = await cookieStore.get('sessionid');
  console.log(session)
  if(session === null){
    redirect("/login");
  }

  return children;
}