'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, Trash2 } from 'lucide-react';
import { toast } from "sonner";

export default function CartItems() {
  // Dummy cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Artisan Oak Coffee Table',
      price: 199.99,
      image: '/oak-table.jpg',
      quantity: 1,
      material: 'Oak'
    },
    {
      id: 2,
      name: 'Walnut Dining Chair',
      price: 249.99,
      image: '/walnut-chair.jpg',
      quantity: 2,
      material: 'Walnut'
    },
    {
      id: 3,
      name: 'Handcrafted Wooden Bowl',
      price: 89.99,
      image: '/wooden-bowl.jpg',
      quantity: 1,
      material: 'Maple'
    }
  ]);

  const incrementQuantity = (id) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    toast(`Item quantity increased`);
  };

  const decrementQuantity = (id) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
    toast(`Item quantity decreased`);
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast(`Item removed from cart`);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (cartItems.length === 0) {
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
            <Button className="bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors">
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-[#3c2415]">Your Cart ({cartItems.length} items)</h2>
      
      {cartItems.map(item => (
        <Card key={item.id} className="w-full">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Product Image */}
              <div className="relative h-24 w-24 bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-[var(--primary-color)]">Image</span>
              </div>
              
              {/* Product Details */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[#3c2415]">{item.name}</h3>
                <p className="text-sm text-gray-600">Material: {item.material}</p>
                <p className="text-[#8B4513] font-bold mt-1">₱{item.price.toFixed(2)}</p>
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-md"
                  onClick={() => decrementQuantity(item.id)}
                >
                  <Minus size={16} />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-md"
                  onClick={() => incrementQuantity(item.id)}
                >
                  <Plus size={16} />
                </Button>
              </div>
              
              {/* Item Total */}
              <div className="text-right min-w-[80px]">
                <p className="font-bold text-[#3c2415]">₱{(item.price * item.quantity).toFixed(2)}</p>
              </div>
              
              {/* Remove Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-500 hover:text-red-500"
                onClick={() => removeItem(item.id)}
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
          
          <Button className="w-full bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors">
            Proceed to Checkout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}