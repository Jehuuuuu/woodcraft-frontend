import { useForm } from "@tanstack/react-form";
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
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";

export default function AddressForm() {
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
    onSubmit: ({ value }) => {
      console.log(value);
    },
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
            <span>Region, Province, City, Barangay</span>
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
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <form.Field
                name="province"
                children={(field) => (
                  <Select
                    name="province"
                    id="province"
                    value={field.state.value}
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
                      <SelectItem value="bacoor">Bacoor</SelectItem>
                      <SelectItem value="cavite">Cavite</SelectItem>
                      <SelectItem value="manila">Manila</SelectItem>
                      <SelectItem value="taraw">Taraw</SelectItem>
                      <SelectItem value="zambales">Zambales</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <form.Field
                name="city"
                children={(field) => (
                  <Select
                    name="city"
                    id="city"
                    value={field.state.value}
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
                      <SelectItem value="imus">Imus</SelectItem>
                      <SelectItem value="dasma">Dasma</SelectItem>
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
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onValueChange={(value) => {
                      field.handleChange(value);
                    }}
                    className={"mt-1"}
                  >
                    <SelectTrigger className={"w-full"}>
                      <SelectValue placeholder="Barangay" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="barangay1">Barangay143</SelectItem>
                      <SelectItem value="barangay2">Barangay2</SelectItem>
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
              id="postalCode"
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
        name="street"
        children={(field) => (
          <div>
            <Label htmlFor="street">Street Name, Building, House No.</Label>
            <Textarea
              type={"text"}
              name="street"
              id="street"
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
        name="isDefault"
        children={(field) => (
          <div className="flex gap-2">
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
      <Button type="submit" className="w-full">
        Save Address
      </Button>
    </Form>
  );
}
