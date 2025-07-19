"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { SyncLoader } from "react-spinners";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import AddressForm from "../addressForm/AddressForm";

export default function Addresses() {
  const { user, setCsrfToken } = useAuthStore();
  const [addressOpen, setAddressOpen] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
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
  const setAsDefault = async (addressId) => {
    try {
      if (!user || !addressId) {
        toast.error("Invalid user or address");
        throw new Error(user, addressId);
      }
      const csrfToken = await setCsrfToken();
      const response = await fetch(
        `${apiURL}/set_default_address/${addressId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({
            user,
            address_id: addressId,
          }),
          credentials: "include",
        }
      );
      if (response.ok) {
        mutate(addressURL);
        toast.success("Default shipping address updated successfully");
      } else {
        toast.error("Error setting address as default");
      }
    } catch (error) {
      console.error("Error setting address as default:", error);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      if (!user || !addressId) {
        toast.error("Invalid user or address");
        throw new Error(user, addressId);
      }
      const csrfToken = await setCsrfToken();
      const response = await fetch(
        `${apiURL}/delete_customer_address/${addressId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok && !data.error) {
        mutate(addressURL);
        toast.success("Address deleted successfully");
      } else {
        console.error(response.statusText && data.error);
        toast.error(data.error || "Error deleting address. Please try again");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-[#3c2415]">My Addresses</h3>
        <Dialog open={addressOpen} onOpenChange={setAddressOpen}>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAsDefault(address.id)}
                        >
                          Set as default
                        </Button>
                      )}
                      <Dialog
                        open={editAddressOpen}
                        onOpenChange={setEditAddressOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="default" size="sm">
                            Edit
                          </Button>
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
                            <AddressForm
                              address={address}
                              setEditAddressOpen={setEditAddressOpen}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete this address?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button
                                className={"bg-red-500 hover:bg-red-500/80"}
                                size="sm"
                                onClick={() => deleteAddress(address.id)}
                              >
                                Delete
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
