"use client";
import AddressForm from "../addressForm/AddressForm";
import { Badge } from "@/components/ui/badge";
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { SyncLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

export default function Addresses(setAddressOpen) {
  const { user, setCsrfToken } = useAuthStore();
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const addressURL = user?.id
    ? `${apiURL}/get_customer_address/${user.id}`
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-[#3c2415]">My Addresses</h3>
        <Dialog>
          <DialogTrigger className="rounded-md px-4 py-[0.65rem] bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors ">
            <Label className="cursor-pointer">
              <PlusCircle size={16} className="mr-1" /> Add New Address
            </Label>
          </DialogTrigger>
          <DialogContent className="max-h-[95vh] flex flex-col">
            <div className="flex flex-col px-2 gap-2">
              <DialogTitle>New Address</DialogTitle>
              <DialogDescription>
                Add a new shipping address by filling out the form below.
              </DialogDescription>
            </div>
            <div className="overflow-y-auto flex-1 px-2">
              {/* <QueryClientProvider client={queryClient}> */}
              <AddressForm setAddressOpen={setAddressOpen} />
              {/* </QueryClientProvider> */}
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
                          <Badge className={"mx-2 bg-[#8B4513] text-white"}>
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
  );
}
