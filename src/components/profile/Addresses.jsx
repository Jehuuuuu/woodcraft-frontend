import { useForm, useStore } from "@tanstack/react-form";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Form } from "../ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "../ui/select";
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
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import regions from "./region.json";
import cities from "./city.json";
import barangays from "./barangay.json";
import provinces from "./province.json";
import zipcodes from "./zipcodes.json";
import getSuggestions from "@/lib/autocomplete";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import getLongLat from "@/lib/geocoder";
import { useDebounce } from "use-debounce";

export default function AddressForm({ setAddressOpen }) {
  const form = useForm({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      region: "",
      province: "",
      city: "",
      barangay: "",
      postalCode: "",
      street: "",
      isDefault: false,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      console.log(data);
      console.log(streetAddress);
      console.log(latitude);
      console.log(longitude);
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
  const [debouncedStreetAddress] = useDebounce(streetAddress, 500);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const errors = useStore(form.store, (state) => state.errorMap);
  const { data } = useQuery({
    queryKey: ["street", debouncedStreetAddress, latitude, longitude],
    queryFn: ({ queryKey }) =>
      getSuggestions(queryKey[1], queryKey[2], queryKey[3]),
    enabled: debouncedStreetAddress.length > 3,
    staleTime: 5 * 1000,
  });
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit;
      }}
    >
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
                className={"mt-1"}
              />
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
                className={"mt-1"}
              />
            </div>
          )}
        />
      </div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className={"w-full"}>
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
                        .filter((city) => city.province_code === provinceByCode)
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
                )}
              />
            </div>
            <div>
              <form.Field
                name="barangay"
                children={(field) => (
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
                        .filter((barangay) => barangay.city_code === cityByCode)
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
              className={"mt-1"}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
            />
          </div>
        )}
      />
      <form.Field
        name="street"
        children={(field) => (
          <div>
            <Label htmlFor="street" className={"mb-2"}>
              Street Name, Building, House No.
            </Label>
            <Command>
              <CommandInput
                value={streetAddress}
                name="street"
                onValueChange={(value) => field.handleChange(value)}
                placeholder="Type your address here..."
                disabled={!postalCodeField}
              />
              <CommandList>
                <CommandEmpty>No suggestions found.</CommandEmpty>
                {/* <CommandGroup heading="Suggestions"></CommandGroup> */}
                {streetAddress.length > 3
                  ? data?.map((suggestion) => {
                      return (
                        <CommandItem
                          key={suggestion.id}
                          value={`${suggestion.name} - ${suggestion.id}`}
                          onSelect={() => {
                            field.handleChange(suggestion.name);
                          }}
                        >
                          <div>{suggestion.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {[
                              suggestion.type,
                              suggestion.city,
                              suggestion.country,
                              suggestion.postcode,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        </CommandItem>
                      );
                    })
                  : null}
              </CommandList>
            </Command>
          </div>
        )}
      />
      <form.Field
        name="isDefault"
        children={(field) => (
          <div className="flex gap-2 mt-4">
            <Checkbox
              name="isDefault"
              id="isDefault"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
            />
            <Label htmlFor="isDefault">Set as Default Address</Label>
          </div>
        )}
      />
      <Button
        type="submit"
        className="w-full"
        onClick={() => {
          form.handleSubmit();
          setAddressOpen(false);
        }}
      >
        Save Address
      </Button>
    </Form>
  );
}
