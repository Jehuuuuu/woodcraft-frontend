import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, ShoppingCart, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import useSWR from "swr";
import { SyncLoader } from "react-spinners";

export default function Designs() {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const { user, setCsrfToken } = useAuthStore();
  const designsUrl = user?.id
    ? `${apiURL}/get_customer_designs?user=${user.id}`
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
    data: designs,
    error,
    isLoading: designsIsLoading,
  } = useSWR(designsUrl, fetcher);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-[#3c2415]">
          My Custom Designs
        </h3>
        <Link href="/configurator">
          <Button className="bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors">
            <PlusCircle size={16} className="mr-2" /> Create New Design
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
        designs.filter((design) => !design.is_added_to_cart).length > 0 ? (
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
                    !design.is_added_to_cart && design.status === "pending"
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
                          <span className="font-medium">Material:</span>{" "}
                          {design.material}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span>{" "}
                          {design.decoration_type}
                        </div>
                        <div>
                          <span className="font-medium">Price:</span> ₱
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
                          onClick={() => handleDesignToCart(user.id, design.id)}
                        >
                          <ShoppingCart size={14} className="mr-1" /> Add to
                          Cart
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
                  !design.is_added_to_cart && design.status === "approved"
              ).length > 0 ? (
                designs
                  .filter(
                    (design) =>
                      !design.is_added_to_cart && design.status === "approved"
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
                            <span className="font-medium">Material:</span>{" "}
                            {design.material}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span>{" "}
                            {design.decoration_type}
                          </div>
                          <div>
                            <span className="font-medium">Price:</span> ₱
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
                            <ShoppingCart size={14} className="mr-1" /> Add to
                            Cart
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
            You haven't created any custom designs yet, or all your approved
            designs are already in the cart. Use our 3D configurator to create
            your first custom woodcraft design.
          </p>
          <Link href="/configurator">
            <Button className="bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors">
              <PlusCircle size={16} className="mr-2" /> Create Your First Design
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
