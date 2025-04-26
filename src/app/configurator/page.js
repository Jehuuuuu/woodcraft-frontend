import ConfiguratorClient from "@/components/configurator/ConfiguratorClient"
import { getUser } from "@/utils/api";

export default async function ConfiguratorPage() {
  try{
    const user_data = await getUser()
    return (
      <ConfiguratorClient user={user_data}/>
    );
  }catch (error) {
    console.error('Error fetching user:', error);
  }
}