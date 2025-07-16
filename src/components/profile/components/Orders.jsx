import getSymbolFromCurrency from "currency-symbol-map";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import useSWR from "swr";
import { SyncLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const { user, setCsrfToken } = useAuthStore();
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
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
    data: orders,
    error: ordersError,
    isLoading: ordersIsLoading,
  } = useSWR(ordersURL, fetcher);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-[#3c2415]">Purchase History</h3>
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
              {orders.filter((item) => item.status === "pending").length > 0 ? (
                orders
                  .filter((item) => item.status === "pending")
                  .map((order, index) => {
                    const currencySymbol = getSymbolFromCurrency(
                      order.currency
                    );
                    return (
                      <div key={order.id || `order-${index}`} className="mb-4">
                        <h3 className="text-lg font-medium text-[#3c2415] mb-2">
                          Order #{order.order_id}
                        </h3>
                        <div className="flex gap-4">
                          <p>Status: {order.status.toUpperCase()}</p>
                          <p>
                            Date:{" "}
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <p>
                            Total: {currencySymbol}
                            {order.total_price}
                          </p>
                          <p>Payment Method: {order.payment_method}</p>
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
                                <p className="font-bold !text-black">Total:</p>
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
              {orders.filter((item) => item.status === "processing").length >
              0 ? (
                orders
                  .filter((item) => item.status === "processing")
                  .map((order, index) => {
                    const currencySymbol = getSymbolFromCurrency(
                      order.currency
                    );
                    return (
                      <div key={order.id || `order-${index}`} className="mb-4">
                        <h3 className="text-lg font-medium text-[#3c2415] mb-2">
                          Order #{order.order_id}
                        </h3>
                        <div className="flex gap-4">
                          <p>Status: {order.status.toUpperCase()}</p>
                          <p>
                            Date:{" "}
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <p>
                            Total: {currencySymbol}
                            {order.total_price}
                          </p>
                          <p>Payment Method: {order.payment_method}</p>
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
                                <p className="font-bold !text-black">Total:</p>
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
              {orders.filter((item) => item.status === "shipped").length > 0 ? (
                orders
                  .filter((item) => item.status === "shipped")
                  .map((order, index) => {
                    const currencySymbol = getSymbolFromCurrency(
                      order.currency
                    );
                    return (
                      <div key={order.id || `order-${index}`} className="mb-4">
                        <h3 className="text-lg font-medium text-[#3c2415] mb-2">
                          Order #{order.order_id}
                        </h3>
                        <div className="flex gap-4">
                          <p>Status: {order.status.toUpperCase()}</p>
                          <p>
                            Date:{" "}
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <p>
                            Total: {currencySymbol}
                            {order.total_price}
                          </p>
                          <p>Payment Method: {order.payment_method}</p>
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
                                <p className="font-bold !text-black">Total:</p>
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
              {orders.filter((item) => item.status === "delivered").length >
              0 ? (
                orders
                  .filter((item) => item.status === "delivered")
                  .map((order, index) => {
                    const currencySymbol = getSymbolFromCurrency(
                      order.currency
                    );
                    return (
                      <div key={order.id || `order-${index}`} className="mb-4">
                        <h3 className="text-lg font-medium text-[#3c2415] mb-2">
                          Order #{order.order_id}
                        </h3>
                        <div className="flex gap-4">
                          <p>Status: {order.status.toUpperCase()}</p>
                          <p>
                            Date:{" "}
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <p>
                            Total: {currencySymbol}
                            {order.total_price}
                          </p>
                          <p>Payment Method: {order.payment_method}</p>
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
                                <p className="font-bold !text-black">Total:</p>
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
              {orders.filter((item) => item.status === "cancelled").length >
              0 ? (
                orders
                  .filter((item) => item.status === "cancelled")
                  .map((order, index) => {
                    const currencySymbol = getSymbolFromCurrency(
                      order.currency
                    );
                    return (
                      <div key={order.id || `order-${index}`} className="mb-4">
                        <h3 className="text-lg font-medium text-[#3c2415] mb-2">
                          Order #{order.order_id}
                        </h3>
                        <div className="flex gap-4">
                          <p>Status: {order.status.toUpperCase()}</p>
                          <p>
                            Date:{" "}
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <p>
                            Total: {currencySymbol}
                            {order.total_price}
                          </p>
                          <p>Payment Method: {order.payment_method}</p>
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
                                <p className="font-bold !text-black">Total:</p>
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
  );
}
