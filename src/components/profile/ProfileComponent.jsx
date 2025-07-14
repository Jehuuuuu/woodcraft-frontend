"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SyncLoader } from "react-spinners";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  Palette,
  PlusCircle,
  PersonStanding,
  ChevronDownIcon,
  Calendar1,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import getSymbolFromCurrency from "currency-symbol-map";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AddressForm from "./addressForm/AddressForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export default function ProfileComponent() {
  const { user, setCsrfToken } = useAuthStore();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
      },
    },
  });
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRendering, setIsRendering] = useState(true);
  const [open, setOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const addressURL = user?.id
    ? `${apiURL}/get_customer_address/${user.id}`
    : null;
  const designsUrl = user?.id
    ? `${apiURL}/get_customer_designs?user=${user.id}`
    : null;
  const ordersURL = user?.id
    ? `${apiURL}/get_customer_orders?user_id=${user.id}`
    : null;

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
    data: addressesData,
    error: addressesError,
    isLoading: addressesIsLoading,
  } = useSWR(addressURL, fetcher);

  const {
    data: designs,
    error,
    isLoading: designsIsLoading,
    mutate,
  } = useSWR(designsUrl, fetcher);
  const {
    data: orders,
    error: ordersError,
    isLoading: ordersIsLoading,
  } = useSWR(ordersURL, fetcher);

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

  const handleDesignToCart = async (user, design_id) => {
    try {
      if (!user || !design_id) {
        toast.error("Invalid user or design");
        throw new Error(user, design_id);
      }
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const csrfToken = await setCsrfToken();
      const quantity = 1;
      const response = await fetch(`${API_URL}/add_design_to_cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          user,
          design_id,
          quantity,
        }),
        credentials: "include",
      });
      if (response.ok) {
        mutate();
        toast.success("Design added to cart successfully");
      } else {
        toast.error("Error adding design to cart");
      }
    } catch (error) {
      console.error("Error adding design to cart:", error);
      toast.error("Error adding design to cart");
    }
  };

  if (
    isRendering ||
    isLoading ||
    customerLoading ||
    ordersIsLoading ||
    addressesIsLoading
  ) {
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
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-[#3c2415]">
                    My Addresses
                  </h3>
                  <Dialog open={addressOpen} onOpenChange={setAddressOpen}>
                    <DialogTrigger className="rounded-md px-4 py-[0.65rem] bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors ">
                      <Label className="cursor-pointer">
                        <PlusCircle size={16} className="mr-1" /> Add New
                        Address
                      </Label>
                    </DialogTrigger>
                    <DialogContent className="max-h-[95vh] flex flex-col">
                      <div className="flex flex-col px-2 gap-2">
                        <DialogTitle>New Address</DialogTitle>
                        <DialogDescription>
                          Add a new shipping address by filling out the form
                          below.
                        </DialogDescription>
                      </div>
                      <div className="overflow-y-auto flex-1 px-2">
                        <QueryClientProvider client={queryClient}>
                          <AddressForm setAddressOpen={setAddressOpen} />
                        </QueryClientProvider>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {addressesIsLoading ? (
                  <div className="flex justify-center py-12">
                    <SyncLoader color="#8B4513" />
                  </div>
                ) : addressesError ? (
                  <div className="py-4 text-center">
                    <p className="text-red-500">
                      Unable to load addresses. Please try again later.
                    </p>
                  </div>
                ) : addressesData ? (
                  addressesData.addresses
                    .sort((a, b) => b.is_default - a.is_default)
                    .map((address) => {
                      return (
                        <Card key={address.id}>
                          <CardHeader>
                            <div className="flex justify-between items-center">
                              <CardTitle>
                                <div className="flex items-center">
                                  {address.customer_name} |{" "}
                                  {address.customer_phone_number}
                                  {address.is_default && (
                                    <Badge
                                      className={"mx-2 bg-[#8B4513] text-white"}
                                    >
                                      Default
                                    </Badge>
                                  )}
                                </div>
                              </CardTitle>
                              <div className="flex gap-2">
                                {!address.is_default && (
                                  <Button variant="outline" size="sm">
                                    Set as default
                                  </Button>
                                )}

                                <Button variant="default" size="sm">
                                  Edit
                                </Button>
                                <Button variant="destructive" size="sm">
                                  Delete
                                </Button>
                              </div>
                            </div>
                            <CardDescription className={"mt-2"}>
                              {address.customer_address}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      );
                    })
                ) : (
                  <p>You don't have any addresses yet.</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="designs">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-[#3c2415]">
                    My Custom Designs
                  </h3>
                  <Link href="/configurator">
                    <Button className="bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors">
                      <PlusCircle size={16} className="mr-2" /> Create New
                      Design
                    </Button>
                  </Link>
                </div>
                {designsIsLoading ? (
                  <div className="flex justify-center py-12">
                    <SyncLoader color="#8B4513" />
                  </div>
                ) : error ? (
                  <div className="py-4 text-center">
                    <p className="text-red-500">
                      Unable to load designs. Please try again later.
                    </p>
                  </div>
                ) : designs &&
                  designs.filter((design) => !design.is_added_to_cart).length >
                    0 ? (
                  <Tabs defaultValue="pending">
                    <TabsList>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="approved">Approved</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {designs
                          .filter(
                            (design) =>
                              !design.is_added_to_cart &&
                              design.status === "pending"
                          )
                          .map((design, index) => (
                            <Card
                              key={design.id || `design-${index}`}
                              className="overflow-hidden"
                            >
                              <div className="relative h-48 bg-[#f0e6d9] flex items-center justify-center">
                                {design.model_image ? (
                                  <img
                                    src={design.model_image}
                                    alt={design.design_description}
                                    className="object-contain h-full w-full"
                                  />
                                ) : (
                                  <Palette
                                    size={48}
                                    className="text-[#8B4513] opacity-50"
                                  />
                                )}
                              </div>
                              <CardContent className="p-4">
                                <h4 className="font-medium text-lg mb-1">
                                  {design.design_description}
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                  <div>
                                    <span className="font-medium">
                                      Material:
                                    </span>{" "}
                                    {design.material}
                                  </div>
                                  <div>
                                    <span className="font-medium">Type:</span>{" "}
                                    {design.decoration_type}
                                  </div>
                                  <div>
                                    <span className="font-medium">Price:</span>{" "}
                                    ₱
                                    {design.final_price
                                      ? design.final_price
                                      : design.estimated_price}
                                  </div>
                                  <div>
                                    <span className="font-medium">Status:</span>{" "}
                                    {design.status ? design.status : "Pending"}
                                  </div>
                                  <div className="col-span-2">
                                    {design.status === "rejected" && (
                                      <p className="font-medium">
                                        Message: {design.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() =>
                                      window.open(design.model_url, "_blank")
                                    }
                                    disabled={!design.model_url}
                                  >
                                    View 3D Model
                                  </Button>
                                  <Button
                                    disabled={
                                      design.status === "rejected" ||
                                      design.status !== "approved"
                                    }
                                    size="sm"
                                    className="flex-1 bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors"
                                    onClick={() =>
                                      handleDesignToCart(user.id, design.id)
                                    }
                                  >
                                    <ShoppingCart size={14} className="mr-1" />{" "}
                                    Add to Cart
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="approved">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {designs.filter(
                          (design) =>
                            !design.is_added_to_cart &&
                            design.status === "approved"
                        ).length > 0 ? (
                          designs
                            .filter(
                              (design) =>
                                !design.is_added_to_cart &&
                                design.status === "approved"
                            )
                            .map((design, index) => (
                              <Card
                                key={design.id || `design-${index}`}
                                className="overflow-hidden"
                              >
                                <div className="relative h-48 bg-[#f0e6d9] flex items-center justify-center">
                                  {design.model_image ? (
                                    <img
                                      src={design.model_image}
                                      alt={design.design_description}
                                      className="object-contain h-full w-full"
                                    />
                                  ) : (
                                    <Palette
                                      size={48}
                                      className="text-[#8B4513] opacity-50"
                                    />
                                  )}
                                </div>
                                <CardContent className="p-4">
                                  <h4 className="font-medium text-lg mb-1">
                                    {design.design_description}
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                    <div>
                                      <span className="font-medium">
                                        Material:
                                      </span>{" "}
                                      {design.material}
                                    </div>
                                    <div>
                                      <span className="font-medium">Type:</span>{" "}
                                      {design.decoration_type}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Price:
                                      </span>{" "}
                                      ₱
                                      {design.final_price
                                        ? design.final_price
                                        : design.estimated_price}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Status:
                                      </span>{" "}
                                      {design.status
                                        ? design.status
                                        : "Pending"}
                                    </div>
                                    <div className="col-span-2">
                                      {design.status === "rejected" && (
                                        <p className="font-medium">
                                          Message: {design.notes}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 mt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1"
                                      onClick={() =>
                                        window.open(design.model_url, "_blank")
                                      }
                                      disabled={!design.model_url}
                                    >
                                      View 3D Model
                                    </Button>
                                    <Button
                                      disabled={
                                        design.status === "rejected" ||
                                        design.status !== "approved"
                                      }
                                      size="sm"
                                      className="flex-1 bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors"
                                      onClick={() =>
                                        handleDesignToCart(user.id, design.id)
                                      }
                                    >
                                      <ShoppingCart
                                        size={14}
                                        className="mr-1"
                                      />{" "}
                                      Add to Cart
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                        ) : (
                          <p>No designs was approved yet.</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-12 bg-[#f9f5f0] rounded-lg">
                    <Palette
                      size={64}
                      className="mx-auto text-[#8B4513] opacity-50 mb-4"
                    />
                    <h3 className="text-xl font-medium text-[#3c2415] mb-2">
                      No Designs Yet
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      You haven't created any custom designs yet, or all your
                      approved designs are already in the cart. Use our 3D
                      configurator to create your first custom woodcraft design.
                    </p>
                    <Link href="/configurator">
                      <Button className="bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors">
                        <PlusCircle size={16} className="mr-2" /> Create Your
                        First Design
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="orders">
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-[#3c2415]">
                  Purchase History
                </h3>
                {ordersIsLoading ? (
                  <div className="flex justify-center py-12">
                    <SyncLoader color="#8B4513" />
                  </div>
                ) : ordersError ? (
                  <div className="py-4 text-center">
                    <p className="text-red-500">
                      Unable to load orders.{" "}
                      {ordersError.status === 422
                        ? "The server could not process the request."
                        : "Please try again later."}
                    </p>
                  </div>
                ) : orders && orders.length > 0 ? (
                  <Tabs defaultValue="pending">
                    <TabsList>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="processing">Processing</TabsTrigger>
                      <TabsTrigger value="shipped">Shipped</TabsTrigger>
                      <TabsTrigger value="delivered">Delivered</TabsTrigger>
                      <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {orders.filter((item) => item.status === "pending")
                          .length > 0 ? (
                          orders
                            .filter((item) => item.status === "pending")
                            .map((order, index) => {
                              const currencySymbol = getSymbolFromCurrency(
                                order.currency
                              );
                              return (
                                <div
                                  key={order.id || `order-${index}`}
                                  className="mb-4"
                                >
                                  <h3 className="text-lg font-medium text-[#3c2415] mb-2">
                                    Order #{order.order_id}
                                  </h3>
                                  <div className="flex gap-4">
                                    <p>Status: {order.status.toUpperCase()}</p>
                                    <p>
                                      Date:{" "}
                                      {new Date(
                                        order.created_at
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex gap-4">
                                    <p>
                                      Total: {currencySymbol}
                                      {order.total_price}
                                    </p>
                                    <p>
                                      Payment Method: {order.payment_method}
                                    </p>
                                  </div>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                      >
                                        {" "}
                                        View Order
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                      <DialogHeader>
                                        <DialogTitle>Order Details</DialogTitle>
                                        <DialogDescription>
                                          Order ID #{order.order_id}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        {order.items.map((item, index) => {
                                          return (
                                            <div
                                              key={`item-${index}`}
                                              className="flex gap-4 items-center"
                                            >
                                              <p>
                                                {item.product_name ||
                                                  item.customer_design ||
                                                  "Custom Design"}
                                              </p>
                                              <p>x{item.quantity}</p>
                                              <p className="ml-auto">
                                                {item.price * item.quantity}
                                              </p>
                                            </div>
                                          );
                                        })}
                                        <div className="flex border-t border-black pt-4 mt-4">
                                          <p className="font-bold !text-black">
                                            Total:
                                          </p>
                                          <p className="ml-auto font-bold !text-black">
                                            {currencySymbol}
                                            {order.total_price}
                                          </p>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              );
                            })
                        ) : (
                          <p>No orders are pending right now.</p>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="processing">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {orders.filter((item) => item.status === "processing")
                          .length > 0 ? (
                          orders
                            .filter((item) => item.status === "processing")
                            .map((order, index) => {
                              const currencySymbol = getSymbolFromCurrency(
                                order.currency
                              );
                              return (
                                <div
                                  key={order.id || `order-${index}`}
                                  className="mb-4"
                                >
                                  <h3 className="text-lg font-medium text-[#3c2415] mb-2">
                                    Order #{order.order_id}
                                  </h3>
                                  <div className="flex gap-4">
                                    <p>Status: {order.status.toUpperCase()}</p>
                                    <p>
                                      Date:{" "}
                                      {new Date(
                                        order.created_at
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex gap-4">
                                    <p>
                                      Total: {currencySymbol}
                                      {order.total_price}
                                    </p>
                                    <p>
                                      Payment Method: {order.payment_method}
                                    </p>
                                  </div>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                      >
                                        {" "}
                                        View Order
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                      <DialogHeader>
                                        <DialogTitle>Order Details</DialogTitle>
                                        <DialogDescription>
                                          Order ID #{order.order_id}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        {order.items.map((item, index) => {
                                          return (
                                            <div
                                              key={`item-${index}`}
                                              className="flex gap-4 items-center"
                                            >
                                              <p>
                                                {item.product_name ||
                                                  item.customer_design ||
                                                  "Custom Design"}
                                              </p>
                                              <p>x{item.quantity}</p>
                                              <p className="ml-auto">
                                                {item.price * item.quantity}
                                              </p>
                                            </div>
                                          );
                                        })}
                                        <div className="flex border-t border-black pt-4 mt-4">
                                          <p className="font-bold !text-black">
                                            Total:
                                          </p>
                                          <p className="ml-auto font-bold !text-black">
                                            {currencySymbol}
                                            {order.total_price}
                                          </p>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              );
                            })
                        ) : (
                          <p>There are currently no orders being processed.</p>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="shipped">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {orders.filter((item) => item.status === "shipped")
                          .length > 0 ? (
                          orders
                            .filter((item) => item.status === "shipped")
                            .map((order, index) => {
                              const currencySymbol = getSymbolFromCurrency(
                                order.currency
                              );
                              return (
                                <div
                                  key={order.id || `order-${index}`}
                                  className="mb-4"
                                >
                                  <h3 className="text-lg font-medium text-[#3c2415] mb-2">
                                    Order #{order.order_id}
                                  </h3>
                                  <div className="flex gap-4">
                                    <p>Status: {order.status.toUpperCase()}</p>
                                    <p>
                                      Date:{" "}
                                      {new Date(
                                        order.created_at
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex gap-4">
                                    <p>
                                      Total: {currencySymbol}
                                      {order.total_price}
                                    </p>
                                    <p>
                                      Payment Method: {order.payment_method}
                                    </p>
                                  </div>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                      >
                                        {" "}
                                        View Order
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                      <DialogHeader>
                                        <DialogTitle>Order Details</DialogTitle>
                                        <DialogDescription>
                                          Order ID #{order.order_id}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        {order.items.map((item, index) => {
                                          return (
                                            <div
                                              key={`item-${index}`}
                                              className="flex gap-4 items-center"
                                            >
                                              <p>
                                                {item.product_name ||
                                                  item.customer_design ||
                                                  "Custom Design"}
                                              </p>
                                              <p>x{item.quantity}</p>
                                              <p className="ml-auto">
                                                {item.price * item.quantity}
                                              </p>
                                            </div>
                                          );
                                        })}
                                        <div className="flex border-t border-black pt-4 mt-4">
                                          <p className="font-bold !text-black">
                                            Total:
                                          </p>
                                          <p className="ml-auto font-bold !text-black">
                                            {currencySymbol}
                                            {order.total_price}
                                          </p>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              );
                            })
                        ) : (
                          <p>There are currently no orders being shipped.</p>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="delivered">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {orders.filter((item) => item.status === "delivered")
                          .length > 0 ? (
                          orders
                            .filter((item) => item.status === "delivered")
                            .map((order, index) => {
                              const currencySymbol = getSymbolFromCurrency(
                                order.currency
                              );
                              return (
                                <div
                                  key={order.id || `order-${index}`}
                                  className="mb-4"
                                >
                                  <h3 className="text-lg font-medium text-[#3c2415] mb-2">
                                    Order #{order.order_id}
                                  </h3>
                                  <div className="flex gap-4">
                                    <p>Status: {order.status.toUpperCase()}</p>
                                    <p>
                                      Date:{" "}
                                      {new Date(
                                        order.created_at
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex gap-4">
                                    <p>
                                      Total: {currencySymbol}
                                      {order.total_price}
                                    </p>
                                    <p>
                                      Payment Method: {order.payment_method}
                                    </p>
                                  </div>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                      >
                                        {" "}
                                        View Order
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                      <DialogHeader>
                                        <DialogTitle>Order Details</DialogTitle>
                                        <DialogDescription>
                                          Order ID #{order.order_id}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        {order.items.map((item, index) => {
                                          return (
                                            <div
                                              key={`item-${index}`}
                                              className="flex gap-4 items-center"
                                            >
                                              <p>
                                                {item.product_name ||
                                                  item.customer_design ||
                                                  "Custom Design"}
                                              </p>
                                              <p>x{item.quantity}</p>
                                              <p className="ml-auto">
                                                {item.price * item.quantity}
                                              </p>
                                            </div>
                                          );
                                        })}
                                        <div className="flex border-t border-black pt-4 mt-4">
                                          <p className="font-bold !text-black">
                                            Total:
                                          </p>
                                          <p className="ml-auto font-bold !text-black">
                                            {currencySymbol}
                                            {order.total_price}
                                          </p>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              );
                            })
                        ) : (
                          <p>No orders have been delivered yet.</p>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="cancelled">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {orders.filter((item) => item.status === "cancelled")
                          .length > 0 ? (
                          orders
                            .filter((item) => item.status === "cancelled")
                            .map((order, index) => {
                              const currencySymbol = getSymbolFromCurrency(
                                order.currency
                              );
                              return (
                                <div
                                  key={order.id || `order-${index}`}
                                  className="mb-4"
                                >
                                  <h3 className="text-lg font-medium text-[#3c2415] mb-2">
                                    Order #{order.order_id}
                                  </h3>
                                  <div className="flex gap-4">
                                    <p>Status: {order.status.toUpperCase()}</p>
                                    <p>
                                      Date:{" "}
                                      {new Date(
                                        order.created_at
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex gap-4">
                                    <p>
                                      Total: {currencySymbol}
                                      {order.total_price}
                                    </p>
                                    <p>
                                      Payment Method: {order.payment_method}
                                    </p>
                                  </div>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                      >
                                        {" "}
                                        View Order
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                      <DialogHeader>
                                        <DialogTitle>Order Details</DialogTitle>
                                        <DialogDescription>
                                          Order ID #{order.order_id}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        {order.items.map((item, index) => {
                                          return (
                                            <div
                                              key={`item-${index}`}
                                              className="flex gap-4 items-center"
                                            >
                                              <p>
                                                {item.product_name ||
                                                  item.customer_design ||
                                                  "Custom Design"}
                                              </p>
                                              <p>x{item.quantity}</p>
                                              <p className="ml-auto">
                                                {item.price * item.quantity}
                                              </p>
                                            </div>
                                          );
                                        })}
                                        <div className="flex border-t border-black pt-4 mt-4">
                                          <p className="font-bold !text-black">
                                            Total:
                                          </p>
                                          <p className="ml-auto font-bold !text-black">
                                            {currencySymbol}
                                            {order.total_price}
                                          </p>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              );
                            })
                        ) : (
                          <p>No orders have been cancelled</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <p>No orders found.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
