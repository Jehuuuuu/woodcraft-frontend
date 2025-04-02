import { SyncLoader } from 'react-spinners';
import { Suspense } from "react"
import ConfiguratorClient from "@/components/configurator/ConfiguratorClient"
import { getUser } from "@/utils/api";

export default async function ConfiguratorPage() {
  let user = null;
  try {
    const response = await getUser();
    if (response.email) user = response;
  } catch (error) {
    console.error('Error fetching user:', error);
  }

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen bg-[var(--background)]">
        <SyncLoader color="#8B4513" size={12} />
      </div>
    }>
      <ConfiguratorClient initialUser={user} />
    </Suspense>
  );
}
