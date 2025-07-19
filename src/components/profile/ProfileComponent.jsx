"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import {
  Calendar1,
  ChevronDownIcon,
  Edit,
  Mail,
  MapPin,
  PersonStanding,
  Phone,
  Save,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { toast } from "sonner";
import useSWR from "swr";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Addresses from "./components/Addresses";
import Designs from "./components/CustomerDesigns";
import Orders from "./components/Orders";
export default function ProfileComponent() {
  const { user, setCsrfToken } = useAuthStore();
  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       refetchOnWindowFocus: false,
  //       staleTime: Infinity,
  //     },
  //   },
  // });
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRendering, setIsRendering] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetcher = async (url) => {
    const csrfToken = await setCsrfToken();
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    });
    const data = await response.json();
    return data || [];
  };

  const {
    data: customerData,
    error: customerError,
    isLoading: customerLoading,
    mutate: customerMutate,
  } = useSWR(`${apiURL}/user`, fetcher);
  const [date, setDate] = useState(customerData?.dateOfBirth);
  const [gender, setGender] = useState(customerData?.gender);
  const [profileData, setProfileData] = useState({
    first_name: customerData?.firstName || "",
    last_name: customerData?.lastName || "",
    email: customerData?.email || "",
    phone_number: customerData?.phoneNumber || "",
    address: customerData?.address || "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    setIsRendering(false);
  }, [user, router]);

  useEffect(() => {
    if (!customerData) return;

    setIsLoading(true);

    try {
      setDate(customerData.dateOfBirth);
      setGender(customerData.gender);
      setProfileData({
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        email: customerData.email,
        phone_number: customerData.phoneNumber,
        address: customerData.address,
      });
    } catch (e) {
      console.error("Error", e);
      toast.error("Error fetching customer data");
    } finally {
      setIsLoading(false);
    }
  }, [customerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const csrfToken = await setCsrfToken();
      formData.append("first_name", profileData.first_name);
      formData.append("last_name", profileData.last_name);
      formData.append("email", profileData.email);
      formData.append("phone_number", profileData.phone_number);
      formData.append("address", profileData.address);
      formData.append("gender", gender);
      formData.append("date_of_birth", date);
      const response = await fetch(
        `${API_URL}/update_customer_info/${user.id}`,
        {
          method: "POST",
          headers: {
            "X-CSRFToken": csrfToken,
          },
          body: formData,
          credentials: "include",
        }
      );
      if (response.ok) {
        customerMutate();
        toast.success("Profile updated successfully");
      } else {
        toast.error("Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      customerMutate();
      toast.error("Error updating profile");
    } finally {
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
      setIsEditing(false);
    }
  };

  if (isRendering || isLoading || customerLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <SyncLoader
          color="#8B4513"
          loading={isRendering}
          size={12}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-24 pb-12 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-serif font-bold text-[#3c2415]">
            My Account
          </CardTitle>
          <CardDescription>
            Manage your profile and view your designs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="designs">Designs</TabsTrigger>
              <TabsTrigger value="orders">Purchase History</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="bg-[#f0e6d9] rounded-full p-12 mb-4">
                    {/* <Input
                      type="file"
                      id="profile-picture"
                      className="hidden"
                      disabled={!isEditing}
                    /> */}
                    <Label htmlFor="profile-picture">
                      <div className="bg-[#f0e6d9] rounded-full  relative">
                        <User size={64} className="text-[#8B4513] " />
                        {/* {isEditing && (
                          <span className="absolute right-[-15] bottom-0.5 cursor-pointer">
                            <Pencil size={20} />
                          </span>
                        )} */}
                      </div>
                    </Label>
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors"
                    >
                      <Edit size={16} className="mr-2" /> Edit Profile
                    </Button>
                  )}
                </div>
                <div className="md:w-2/3">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          defaultValue={customerData.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          defaultValue={customerData.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail size={16} className="text-[#8B4513]" /> Email
                        Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={customerData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <Label
                        htmlFor="phone_number"
                        className="flex items-center gap-2"
                      >
                        <Phone size={16} className="text-[#8B4513]" /> Phone
                        Number
                      </Label>
                      <Input
                        id="phone_number"
                        name="phone_number"
                        defaultValue={customerData.phoneNumber}
                        type="tel"
                        maxLength="11"
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <Label
                        htmlFor="address"
                        className="flex items-center gap-2"
                      >
                        <MapPin size={16} className="text-[#8B4513]" /> Address
                      </Label>
                      <Textarea
                        id="address"
                        name="address"
                        defaultValue={customerData.address || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-[10%]">
                      <div>
                        <Label>
                          <PersonStanding
                            size={16}
                            className="text-[#8B4513]"
                          />
                          Gender
                        </Label>
                        <RadioGroup
                          value={gender}
                          onValueChange={(value) => setGender(value)}
                        >
                          <div className="flex gap-3 mt-2">
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value="male"
                                id="r1"
                                className="w-5 h-5"
                                disabled={!isEditing}
                              />
                              <Label htmlFor="r1">Male</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value="female"
                                id="r2"
                                className="w-5 h-5"
                                disabled={!isEditing}
                              />
                              <Label htmlFor="r2">Female</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value="other"
                                id="r3"
                                className="w-5 h-5"
                                disabled={!isEditing}
                              />
                              <Label htmlFor="r3">Other</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="date" className="px-1">
                          <Calendar1 size={16} className="text-[#8B4513]" />
                          Date of birth
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date"
                              className="w-48 justify-between font-normal"
                              disabled={!isEditing}
                            >
                              {date
                                ? date
                                : customerData.dateOfBirth
                                ? customerData.dateOfBirth
                                : "Select Date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={date}
                              captionLayout="dropdown"
                              onSelect={(selectedDate) => {
                                if (selectedDate) {
                                  const year = selectedDate.getFullYear();
                                  const month = String(
                                    selectedDate.getMonth() + 1
                                  ).padStart(2, "0");
                                  const day = String(
                                    selectedDate.getDate()
                                  ).padStart(2, "0");
                                  setDate(`${year}-${month}-${day}`);
                                }
                                setOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* <div className="mb-6">
                      <Label htmlFor="bio">About Me</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="mt-1"
                        rows={4}
                      />
                    </div> */}
                    {isEditing && (
                      <div className="flex gap-4 justify-end mt-5">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors"
                        >
                          <Save size={16} className="mr-2" /> Save Changes
                        </Button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="addresses">
              <Addresses />
            </TabsContent>
            <TabsContent value="designs">
              <Designs />
            </TabsContent>
            <TabsContent value="orders">
              <Orders />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
