import ConfiguratorClient from "@/components/configurator/ConfiguratorClient"
export default async function ConfiguratorPage() {
  try{
    const response =  await fetch("https://woodcraft-backend.onrender.com/api/user");
    const data = await response.json();
    let user_data;
    if (data.email) {
    user_data = data;
    }else{
    user_data = null;
    }
  return (
      <ConfiguratorClient user={user_data}/>
    );
  }catch (error) {
    console.error('Error fetching user:', error);
  }
}