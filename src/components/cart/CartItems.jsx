"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CartItems() {
  const { user, setCsrfToken } = useAuthStore();
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currency, setCurrency] = useState("PHP");
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const router = useRouter();
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const cartUrl = user?.id ? `${apiURL}/cart?user=${user.id}` : null;

  const fetcher = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const { data, error, isLoading, mutate } = useSWR(cartUrl, fetcher);

  useEffect(() => {
    if (data) {
      setCartItems(data.cart_items || []);
      setTotalItems(data.total_items || 0);
      setTotalPrice(parseFloat(data.total_price) || 0);
    }
  }, [data]);

  if (error) {
    console.error(error);
    toast.error("Error fetching cart items, please try again later.");
  }

  const incrementQuantity = async (id) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);

      const updatedItems = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );

      const item = cartItems.find((item) => item.cart_item_id_num === id);

      const csrfToken = await setCsrfToken();
      const quantity = item.quantity + 1;
      console.log(quantity);

      const response = await fetch(`${apiURL}/update_cart_item/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }
      mutate();
      await useAuthStore.getState().getCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
      mutate();
    } finally {
      setIsUpdating(false);
    }
  };

  const decrementQuantity = async (id) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);

      const item = cartItems.find((item) => item.cart_item_id_num === id);

      if (item.quantity <= 1) {
        setIsUpdating(false);
        return;
      }

      const updatedItems = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );

      const csrfToken = await setCsrfToken();
      const quantity = item.quantity - 1;
      const response = await fetch(`${apiURL}/update_cart_item/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      mutate();
      await useAuthStore.getState().getCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
      mutate();
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async (id) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);

      // Optimistically update UI
      const updatedItems = cartItems.filter((item) => item.id !== id);

      // Make API call to remove the item
      const csrfToken = await setCsrfToken();
      const response = await fetch(`${apiURL}/delete_cart_item/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          cart_item_id: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      // Revalidate the cart data
      mutate();
      await useAuthStore.getState().getCartItems();
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
      mutate();
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateSubtotal = () => {
    return (
      totalPrice ||
      cartItems.reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0
      )
    );
  };

  const handleCheckout = async () => {
    try {
      setIsProcessingCheckout(true);
      toast.info("Proceeding to checkout...");

      const successUrl =
        "https://woodcraft-frontend.vercel.app/checkout/success?session_id={CHECKOUT_SESSION_ID}";
      const cancelUrl = "https://woodcraft-frontend.vercel.app/checkout/cancel";

      const response = await fetch(`${apiURL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": await setCsrfToken(),
        },
        credentials: "include",
        body: JSON.stringify({
          user_id: user?.id,
          currency: currency,
          success_url: successUrl,
          cancel_url: cancelUrl,
        }),
      });

      const data = await response.json();
      console.log("Checkout response:", data);

      if (response.ok && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
        toast.error("Could not initiate checkout. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred during checkout. Please try again.");
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p>Loading your cart...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-[#f0e6d9] rounded-full p-6 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-[#8B4513]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-[#3c2415] mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button
              className="bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors"
              onClick={() => router.push("/catalog")}
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-[#3c2415]">
        Your Cart ({totalItems} items)
      </h2>

      {cartItems.map((item, index) => (
        <Card key={index} className="w-full">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Product Image */}
              <div className="relative h-24 w-24 bg-gray-100 rounded-md flex items-center justify-center">
                <Image
                  src={
                    item.product_image
                      ? `https://woodcraft-backend.onrender.com${item.product_image}`
                      : "/placeholder.svg"
                  }
                  alt={item.product_name}
                  fill
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 rounded-md"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[#3c2415]">
                  {item.product_name}
                </h3>
                {item.material && (
                  <p className="text-sm text-gray-600">
                    Material: {item.material}
                  </p>
                )}
                <p className="text-[#8B4513] font-bold mt-1">
                  ₱{parseFloat(item.price).toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-md"
                  onClick={() => decrementQuantity(item.cart_item_id_num)}
                >
                  <Minus size={16} />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-md"
                  onClick={() => incrementQuantity(item.cart_item_id_num)}
                  // disabled={isUpdating || item.quantity >= item.product.stock}
                >
                  <Plus size={16} />
                </Button>
              </div>

              {/* Item Total */}
              <div className="text-right min-w-[80px]">
                <p className="font-bold text-[#3c2415]">
                  ₱{parseFloat(item.total_price).toFixed(2)}
                </p>
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-red-500"
                onClick={() => removeItem(item.cart_item_id_num)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Order Summary */}
      <Card className="w-full">
        <CardContent className="p-6">
          <h3 className="text-xl font-medium text-[#3c2415] mb-4">
            Order Summary
          </h3>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                ₱{calculateSubtotal().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">₱150.00</span>
            </div>
            {/* <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">₱{(calculateSubtotal() * 0.12).toFixed(2)}</span>
            </div> */}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between">
              <span className="text-lg font-medium text-[#3c2415]">Total</span>
              <span className="text-lg font-bold text-[#3c2415]">
                ₱
                {(
                  calculateSubtotal() +
                  150 +
                  calculateSubtotal() * 0.12
                ).toFixed(2)}
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-xl">Payment Methods</h1>
            <RadioGroup
              className={"grid grid-cols-3 py-4"}
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value)}
            >
              <Label
                htmlFor="cash_on_delivery"
                className="flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-[var(--light-bg)] hover:text-[var(--text-dark)] [&:has([data-state=checked])]:border-[var(--primary-color)]"
              >
                <RadioGroupItem
                  value="cash_on_delivery"
                  id="cash_on_delivery"
                  className={"sr-only"}
                ></RadioGroupItem>
                <Truck />
                <span className="text-sm">Cash on Delivery</span>
              </Label>
              <Label
                htmlFor="stripe"
                className="flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-[var(--light-bg)] hover:text-[var(--text-dark)] [&:has([data-state=checked])]:border-[var(--primary-color)]"
              >
                <RadioGroupItem
                  value="stripe"
                  id="stripe"
                  className={"sr-only"}
                ></RadioGroupItem>
                <Image
                  src={"/Stripe_Logo.svg"}
                  alt="stripe_logo"
                  width={60}
                  height={30}
                />
                <span className="text-sm">(Visa, MasterCard, etc.)</span>
              </Label>
              <Label
                htmlFor="gcash"
                className="flex flex-col border-2 rounded-md items-center justify-between p-4 hover:bg-[var(--light-bg)] hover:text-[var(--text-dark)] [&:has([data-state=checked])]:border-[var(--primary-color)]"
              >
                <RadioGroupItem
                  value="gcash"
                  id="gcash"
                  className={"sr-only"}
                ></RadioGroupItem>
                <Image
                  src={"/GCash_logo.svg"}
                  alt="GCash_logo"
                  width={100}
                  height={30}
                />
                <span className="text-sm">GCash</span>
              </Label>
            </RadioGroup>
          </div>
          <Dialog>
            <DialogTrigger className="w-full bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors py-2 px-4 rounded-md">
              Proceed to Checkout
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Product Currency</DialogTitle>
                <DialogDescription>
                  Please select your preferred currency for checkout. This will
                  determine the currency used for your payment.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 mx-auto">
                <RadioGroup
                  defaultValue="PHP"
                  onValueChange={(value) => setCurrency(value)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <RadioGroupItem value="PHP" id="php" />
                    <span className="text-xl">🇵🇭</span>
                    <Label htmlFor="php" className="font-medium">
                      Philippines (PHP ₱)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 mb-3">
                    <RadioGroupItem value="USD" id="usd" />
                    <span className="text-xl">🇺🇸</span>
                    <Label htmlFor="usd" className="font-medium">
                      United States (USD $)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 mb-3">
                    <RadioGroupItem value="CAD" id="cad" />
                    <span className="text-xl">🇨🇦</span>
                    <Label htmlFor="cad" className="font-medium">
                      Canada (CAD $)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <DialogFooter>
                <Button
                  className="w-full bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors"
                  onClick={handleCheckout}
                >
                  {isProcessingCheckout
                    ? "Processing..."
                    : ` Checkout with ${currency}`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
