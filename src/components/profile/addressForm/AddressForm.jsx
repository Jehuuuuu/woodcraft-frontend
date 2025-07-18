"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import getLongLat from "@/lib/geocoder";
import { useAuthStore } from "@/store/authStore";
import { useForm, useStore } from "@tanstack/react-form";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Form } from "../../ui/form";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import barangays from "./barangay.json";
import cities from "./city.json";
import provinces from "./province.json";
import regions from "./region.json";
import FieldInfo, { AddressSchema } from "./schema/addressSchema";
import zipcodes from "./zipcodes.json";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
});

export default function AddressForm({
  setAddressOpen,
  address,
  setEditAddressOpen,
}) {
  const { user, setCsrfToken } = useAuthStore();
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const addressURL = user?.id
    ? `${apiURL}/get_customer_address/${user.id}`
    : null;

  const form = useForm({
    defaultValues: {
      fullName: address?.customer_name || "",
      phoneNumber: address?.customer_phone_number || "",
      region: address?.region || "",
      province: address?.province || "",
      city: address?.city || "",
      barangay: address?.barangay || "",
      postalCode: address?.postal_code || "",
      street: address?.street || "",
      isDefault: address?.is_default || false,
    },
    validators: {
      onSubmit: AddressSchema,
      // onChange: AddressSchema,
    },
    onSubmit: async ({ value }) => {
      const userId = user.id;
      const full_address = `${value.street}, ${value.barangay}, ${value.city}, ${value.province}, ${value.region}, ${value.postalCode}`;
      const csrfToken = await setCsrfToken();
      console.log(value);
      try {
        if (address.id) {
          const response = await fetch(
            `${apiURL}/update_customer_address/${address?.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
              },
              credentials: "include",
              body: JSON.stringify({
                customer_name: value.fullName,
                customer_phone_number: value.phoneNumber,
                region: value.region,
                province: value.province,
                city: value.city,
                barangay: value.barangay,
                postal_code: value.postalCode,
                street: value.street,
                customer_address: full_address,
                is_default: value.isDefault,
                latitude: latitude,
                longitude: longitude,
              }),
            }
          );
          if (response.ok) {
            mutate(addressURL);
            toast.success("Address edited successfully");
            setEditAddressOpen(false);
          } else {
            console.error(response.status, response.statusText);
            toast.error("Error editing address, Please try again.");
          }
        } else {
          const response = await fetch(`${apiURL}/create_customer_address`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({
              user_id: userId,
              customer_name: value.fullName,
              customer_phone_number: value.phoneNumber,
              region: value.region,
              province: value.province,
              city: value.city,
              barangay: value.barangay,
              postal_code: value.postalCode,
              street: value.street,
              customer_address: address,
              is_default: value.isDefault,
              latitude: latitude,
              longitude: longitude,
            }),
            credentials: "include",
          });
          mutate(addressURL);
          if (response.ok) {
            setAddressOpen(false);
          } else {
            console.error(response.status, response.statusText);
            setError("Error creating address, Please try again.");
          }
        }
      } catch (e) {
        console.error(e);
        setError("Error creating address, Please try again.");
      }
    },
  });
  const region = useStore(form.store, (state) => state.values.region);
  const regionSelected = region
    ? regions.find((r) => r.region_name === region)
    : null;
  const regionByCode = regionSelected ? regionSelected.region_code : null;
  const province = useStore(form.store, (state) => state.values.province);
  const provinceSelected = province
    ? provinces.find((p) => p.province_name === province)
    : null;
  const provinceByCode = provinceSelected
    ? provinceSelected.province_code
    : null;
  const city = useStore(form.store, (state) => state.values.city);
  const citySelected = cities.find((c) => c.city_name === city);
  const cityByCode = citySelected ? citySelected.city_code : null;
  const barangay = useStore(form.store, (state) => state.values.barangay);
  const zipCode = Object.keys(zipcodes).find((z) => zipcodes[z] === city);
  const postalCodeField = useStore(
    form.store,
    (state) => state.values.postalCode
  );
  const streetAddress = useStore(form.store, (state) => state.values.street);
  // const [debouncedStreetAddress] = useDebounce(streetAddress, 500);
  const [error, setError] = useState(null);
  // const [stopSearching, setStopSearching] = useState(false);
  const [latitude, setLatitude] = useState(address?.latitude || null);
  const [longitude, setLongitude] = useState(address?.longitude || null);
  // const { data } = useQuery({
  //   queryKey: ["street", debouncedStreetAddress, latitude, longitude],
  //   queryFn: async ({ queryKey }) => {
  //     if (!stopSearching) {
  //       return await getSuggestions(queryKey[1], queryKey[2], queryKey[3]);
  //     }
  //     return [];
  //   },

  //   enabled: debouncedStreetAddress.length > 3,
  //   staleTime: 5 * 1000,
  // });
  return (
    <Form>
      <form.Subscribe
        selector={(state) => [state.errors]}
        children={([errors]) =>
          errors && errors.length > 0 ? (
            <div className="mb-3">
              <Alert variant={"destructive"}>
                <AlertTitle>Form Error</AlertTitle>
                <AlertDescription>
                  All fields are required. Please provide valid details
                </AlertDescription>
              </Alert>
            </div>
          ) : null
        }
      />
      {error && (
        <div className="mb-3">
          <Alert variant={"destructive"}>
            <AlertTitle>Form Error</AlertTitle>
            <AlertDescription>
              All fields are required. Please provide valid details
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field
          name="fullName"
          children={(field) => (
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                type={"text"}
                name="fullName"
                id="fullName"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                }}
                className={"my-2"}
              />
              <FieldInfo field={field} />
            </div>
          )}
        />
        <form.Field
          name="phoneNumber"
          children={(field) => (
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                type={"number"}
                name="phoneNumber"
                id="phoneNumber"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                }}
                className={"my-2"}
              />
              <FieldInfo field={field} />
            </div>
          )}
        />
      </div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className={"w-full my-2"}>
            <span className="text-wrap">
              {region ? region : "Region"}, {province ? province : "Province"},{" "}
              {city ? city : "City"}, {barangay ? barangay : "Barangay"}
            </span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select location</DrawerTitle>
            <DrawerDescription>
              Please choose your region, province, city, and barangay.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mx-10">
            <div>
              <form.Field
                name="region"
                listeners={{
                  onChange: () => {
                    form.setFieldValue("province", "");
                    form.setFieldValue("city", "");
                    form.setFieldValue("barangay", "");
                  },
                }}
                children={(field) => (
                  <>
                    <Select
                      name="region"
                      id="region"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onValueChange={(value) => {
                        field.handleChange(value);
                      }}
                      className={"mt-1"}
                    >
                      <SelectTrigger className={"w-full"}>
                        <SelectValue placeholder="Region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem
                            key={region.psgc_code}
                            value={region.region_name}
                          >
                            {region.region_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldInfo field={field} />
                  </>
                )}
              />
            </div>
            <div>
              <form.Field
                name="province"
                listeners={{
                  onChange: () => {
                    form.setFieldValue("city", "");
                    form.setFieldValue("barangay", "");
                  },
                }}
                children={(field) => (
                  <>
                    <Select
                      name="province"
                      id="province"
                      value={field.state.value}
                      disabled={!region}
                      onBlur={field.handleBlur}
                      onValueChange={(value) => {
                        field.handleChange(value);
                      }}
                      className={"mt-1"}
                    >
                      <SelectTrigger className={"w-full"}>
                        <SelectValue placeholder="Province" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces
                          .filter(
                            (province) => province.region_code === regionByCode
                          )
                          .map((province) => {
                            return (
                              <SelectItem
                                key={province.psgc_code}
                                value={province.province_name}
                              >
                                {province.province_name}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                    <FieldInfo field={field} />
                  </>
                )}
              />
            </div>
            <div>
              <form.Field
                name="city"
                listeners={{
                  onChange: () => {
                    form.setFieldValue("barangay", "");
                  },
                }}
                children={(field) => (
                  <>
                    <Select
                      name="city"
                      id="city"
                      value={field.state.value}
                      disabled={!province}
                      onBlur={field.handleBlur}
                      onValueChange={(value) => {
                        field.handleChange(value);
                      }}
                      className={"mt-1"}
                    >
                      <SelectTrigger className={"w-full"}>
                        <SelectValue placeholder="City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities
                          .filter(
                            (city) => city.province_code === provinceByCode
                          )
                          .map((city) => {
                            return (
                              <SelectItem
                                key={city.psgc_code}
                                value={city.city_name}
                              >
                                {city.city_name}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                    <FieldInfo field={field} />
                  </>
                )}
              />
            </div>
            <div>
              <form.Field
                name="barangay"
                children={(field) => (
                  <>
                    <Select
                      name="barangay"
                      id="barangay"
                      disabled={!city}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onValueChange={(value) => {
                        field.handleChange(value);
                        (async () => {
                          try {
                            const longLat = await getLongLat(
                              city,
                              province,
                              region
                            );
                            if (longLat) {
                              setLatitude(longLat.lat);
                              setLongitude(longLat.lon);
                            } else {
                              setLatitude("14.5995");
                              setLongitude("120.9842");
                            }
                          } catch (error) {
                            console.error(error);
                          }
                        })();
                      }}
                      className={"mt-1"}
                    >
                      <SelectTrigger className={"w-full"}>
                        <SelectValue placeholder="Barangay" />
                      </SelectTrigger>
                      <SelectContent>
                        {barangays
                          .filter(
                            (barangay) => barangay.city_code === cityByCode
                          )
                          .map((barangay) => {
                            return (
                              <SelectItem
                                key={barangay.brgy_code}
                                value={barangay.brgy_name}
                              >
                                {barangay.brgy_name}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                    <FieldInfo field={field} />
                  </>
                )}
              />
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className={"mx-auto"}>
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <form.Field
        name="postalCode"
        children={(field) => (
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              type={"number"}
              name="postalCode"
              disabled={!barangay}
              id="postalCode"
              placeholder={zipCode}
              value={field.state.value}
              className={"my-2"}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
            />
            <FieldInfo field={field} />
          </div>
        )}
      />
      <form.Field
        name="street"
        children={(field) => (
          <div>
            <Label htmlFor="street">Street Name, Building, House No.</Label>
            <Input
              type={"text"}
              name="street"
              id="street"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
              className={"my-2"}
            />
            <FieldInfo field={field} />
          </div>
        )}
      />
      {latitude && longitude && (
        <div className="border-2 my-2 " style={{ height: "250px" }}>
          <Map
            lat={latitude}
            lon={longitude}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
          />
        </div>
      )}
      <form.Field
        name="isDefault"
        children={(field) => (
          <div className="flex gap-2 my-2">
            <Checkbox
              name="isDefault"
              id="isDefault"
              value={field.state.value}
              checked={field.state.value}
              onCheckedChange={(checked) => {
                field.handleChange(checked);
              }}
            />
            <Label htmlFor="isDefault">Set as Default Address</Label>
          </div>
        )}
      />

      <form.Subscribe
        selector={(state) => [
          state.isSubmitting,
          state.canSubmit,
          state.errors,
        ]}
        children={([isSubmitting, canSubmit]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={"w-full my-2"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            {isSubmitting ? "Saving..." : "Save Address"}
          </Button>
        )}
      />
    </Form>
  );
}
