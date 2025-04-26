"use client"
import ConfiguratorClient from "@/components/configurator/ConfiguratorClient"
import { useAuthStore } from "@/store/authStore";

export default function ConfiguratorPage() {
const {user} = useAuthStore();

return (
  <ConfiguratorClient user={user}/>
);
}