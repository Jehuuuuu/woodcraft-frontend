'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import useSWR from 'swr';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
export default function CartItems() {
  const { user, setCsrfToken } = useAuthStore();
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const cartUrl = user?.id ? `https://woodcraft-backend.onrender.com/api/cart?user=${user.id}` : null;

  const fetcher = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  
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
      
      const updatedItems = cartItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      
      const item = cartItems.find(item => item.cart_item_id_num === id);
      
      const csrfToken = await setCsrfToken();
      const quantity = item.quantity + 1;
      console.log(quantity)
      

      const response = await fetch(`https://woodcraft-backend.onrender.com/api/update_cart_item/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
          quantity
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }
      mutate();
      await useAuthStore.getState().getCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
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
      
      const item = cartItems.find(item => item.cart_item_id_num === id);
      
      if (item.quantity <= 1) {
        setIsUpdating(false);
        return;
      }
      
      const updatedItems = cartItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
      
      const csrfToken = await setCsrfToken();
      const quantity = item.quantity - 1;
      const response = await fetch(`https://woodcraft-backend.onrender.com/api/update_cart_item/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
            quantity
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }
      
      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }
      
      mutate();
      await useAuthStore.getState().getCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
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
      const updatedItems = cartItems.filter(item => item.id !== id);
      
      // Make API call to remove the item
      const csrfToken = await setCsrfToken();
      const response = await fetch(`https://woodcraft-backend.onrender.com/api/delete_cart_item/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
          cart_item_id: id
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item');
      }
      
      // Revalidate the cart data
      mutate();
      await useAuthStore.getState().getCartItems();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error("Failed to remove item");
      mutate();
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateSubtotal = () => {
    return totalPrice || cartItems.reduce((total, item) => 
      total + (parseFloat(item.price) * item.quantity), 0);
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-[#3c2415] mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6 text-center">Looks like you haven't added any items to your cart yet.</p>
            <Button className="bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors" onClick = {() => router.push("/catalog") }>
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-[#3c2415]">Your Cart ({totalItems} items)</h2>
    
      {cartItems.map((item, index) => (
        <Card key={index} className="w-full">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Product Image */}
              <div className="relative h-24 w-24 bg-gray-100 rounded-md flex items-center justify-center">
              <Image
                    src={item.product_image ? `https://woodcraft-backend.onrender.com${item.product_image}` : "/placeholder.svg"}
                    alt={item.product_name}
                    fill
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 rounded-md"
                  />
                  
              </div>
              
              {/* Product Details */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[#3c2415]">{item.product_name}</h3>
                {item.material && <p className="text-sm text-gray-600">Material: {item.material}</p>}
                <p className="text-[#8B4513] font-bold mt-1">₱{parseFloat(item.price).toFixed(2)}</p>
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
                >
                  <Plus size={16} />
                </Button>
              </div>
              
              {/* Item Total */}
              <div className="text-right min-w-[80px]">
                <p className="font-bold text-[#3c2415]">₱{parseFloat(item.total_price).toFixed(2)}</p>
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
          <h3 className="text-xl font-medium text-[#3c2415] mb-4">Order Summary</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₱{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">₱150.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">₱{(calculateSubtotal() * 0.12).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between">
              <span className="text-lg font-medium text-[#3c2415]">Total</span>
              <span className="text-lg font-bold text-[#3c2415]">
                ₱{(calculateSubtotal() + 150 + calculateSubtotal() * 0.12).toFixed(2)}
              </span>
            </div>
          </div>
          
          <Button className="w-full bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors"
          onClick = {() => toast.info("TODO: add stripe and gcash checkout api")}>
            Proceed to Checkout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}