"use client";

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SyncLoader } from "react-spinners";
import { User, Mail, Phone, MapPin, Edit, Save, Palette, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import getSymbolFromCurrency from 'currency-symbol-map'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ProfileComponent() {
  const { user, setCsrfToken } = useAuthStore();
  const router = useRouter();
  const [isRendering, setIsRendering] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    setIsRendering(false);
  }, [user, router]);

  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const designsUrl = user?.id ? `${apiURL}/get_customer_designs?user=${user.id}` : null;
  const ordersURL = user?.id ? `${apiURL}/get_customer_orders?user_id=${user.id}` : null;
  const fetcher = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const { data: designs, error, isLoading, mutate } = useSWR(designsUrl, fetcher);
  const { data: orders, error: ordersError, isLoading: ordersIsLoading, mutate: ordersMutate } = useSWR(ordersURL, fetcher);
  
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      });
      
      if (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data');
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };

  const handleDesignToCart = async (user, design_id) => {
    try {
      if (!user || !design_id) {
        toast.error('Invalid user or design');
        throw new Error(user, design_id);
      }
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const csrfToken = await setCsrfToken();
      const quantity = 1;
      const response = await fetch(`${API_URL}/add_design_to_cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          user,
          design_id,
          quantity
        }),
        credentials: 'include'
      });
      if (response.ok) {
        mutate();
        toast.success('Design added to cart successfully');
      } else {
        toast.error('Error adding design to cart');
      }
    } catch (error) {
      console.error('Error adding design to cart:', error);
      toast.error('Error adding design to cart');
    }
  };

  if (isRendering) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <SyncLoader
          color="#8B4513"
          loading={isRendering}
          size={12}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-24 pb-12 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-serif font-bold text-[#3c2415]">My Account</CardTitle>
          <CardDescription>Manage your profile and view your designs</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" onClick={() => setActiveTab("profile")}>Profile</TabsTrigger>
              <TabsTrigger value="designs" onClick={() => setActiveTab("designs")}>My Designs</TabsTrigger>
              <TabsTrigger value="orders" onClick={() => setActiveTab("orders")}>Purchase History</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="bg-[#f0e6d9] rounded-full p-12 mb-4">
                    <User size={64} className="text-[#8B4513]" />
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors"
                    >
                      <Edit size={16} className="mr-2" /> Edit Profile
                    </Button>
                  )}
                </div>
                <div className="md:w-2/3">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail size={16} className="text-[#8B4513]" /> Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleChange}
                        disabled={true}
                        className="mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone size={16} className="text-[#8B4513]" /> Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#8B4513]" /> Address
                      </Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div className="mb-6">
                      <Label htmlFor="bio">About Me</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                    {isEditing && (
                      <div className="flex gap-4 justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors"
                        >
                          <Save size={16} className="mr-2" /> Save Changes
                        </Button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="designs">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-[#3c2415]">Your Custom Designs</h3>
                  <Link href="/configurator">
                    <Button className="bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors">
                      <PlusCircle size={16} className="mr-2" /> Create New Design
                    </Button>
                  </Link>
                </div>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <SyncLoader color="#8B4513" />
                  </div>
                ) : error ? (
                  <div className="py-4 text-center">
                    <p className="text-red-500">Unable to load designs. Please try again later.</p>
                  </div>
                ) : designs && designs.filter(design => !design.is_added_to_cart).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {designs
                      .filter(design => !design.is_added_to_cart)
                      .map((design, index) => (
                        <Card key={design.id || `design-${index}`} className="overflow-hidden">
                          <div className="relative h-48 bg-[#f0e6d9] flex items-center justify-center">
                            {design.model_image ? (
                              <img
                                src={design.model_image}
                                alt={design.design_description}
                                className="object-contain h-full w-full"
                              />
                            ) : (
                              <Palette size={48} className="text-[#8B4513] opacity-50" />
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-medium text-lg mb-1">{design.design_description}</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                              <div>
                                <span className="font-medium">Material:</span> {design.material}
                              </div>
                              <div>
                                <span className="font-medium">Type:</span> {design.decoration_type}
                              </div>
                              <div>
                                <span className="font-medium">Price:</span> ₱{design.final_price ? design.final_price : design.estimated_price}
                              </div>
                              <div>
                                <span className="font-medium">Status:</span> {design.status ? design.status : "Pending"}
                              </div>
                              <div className="col-span-2">
                                {design.status === 'rejected' && (
                                  <p className='font-medium'>Message: {design.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => window.open(design.model_url, '_blank')}
                                disabled={!design.model_url}
                              >
                                View 3D Model
                              </Button>
                              <Button
                                disabled={design.status === 'rejected' || design.status !== 'approved'}
                                size="sm"
                                className="flex-1 bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors"
                                onClick={() => handleDesignToCart(user.id, design.id)}
                              >
                                <ShoppingCart size={14} className="mr-1" /> Add to Cart
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-[#f9f5f0] rounded-lg">
                    <Palette size={64} className="mx-auto text-[#8B4513] opacity-50 mb-4" />
                    <h3 className="text-xl font-medium text-[#3c2415] mb-2">No Designs Yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      You haven't created any custom designs yet, or all your approved designs are already in the cart. Use our 3D configurator to create your first custom woodcraft design.
                    </p>
                    <Link href="/configurator">
                      <Button className="bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors">
                        <PlusCircle size={16} className="mr-2" /> Create Your First Design
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="orders">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-[#3c2415]">Purchase History</h3>
                </div>
                {ordersIsLoading ? 
                  <div className="flex justify-center py-12">
                    <SyncLoader color="#8B4513" />
                  </div>  
                  : ordersError ? (
                    <div className="py-4 text-center">
                      <p className="text-red-500">Unable to load orders. {ordersError.status === 422 ? 'The server could not process the request.' : 'Please try again later.'}</p>
                    </div>
                  ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    {orders && orders.length > 0 ? (
                        orders.map((order, index) => {
                          const currencySymbol = getSymbolFromCurrency(order.currency);
                          return (
                              <div key={order.id || `order-${index}`} className="mb-4">
                                <h3 className="text-lg font-medium text-[#3c2415] mb-2">Order #{order.order_id}</h3>
                                <div className='flex gap-4'>
                                  <p>Status: {order.status.toUpperCase()}</p>
                                  <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <p>Total: {currencySymbol}{order.total_price}</p>
                                <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="mt-2"> View Order</Button>
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
                                          <div key={`item-${index}`} className="flex gap-4 items-center">
                                            <p>{item.product_name || item.customer_design || 'Custom Design'}</p>
                                            <p>x{item.quantity}</p>
                                            <p className='ml-auto'>{item.price * item.quantity}</p>
                                          </div>
                                          
                                        )
                                      })}
                                      <div className='flex border-t border-black pt-4 mt-4'>
                                        <p className='font-bold !text-black'>Total:</p>
                                        <p className='ml-auto font-bold !text-black'>{currencySymbol}{order.total_price}</p>
                                      </div>
                                      
                                 
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          );
                        })
                    
                      ) : (
                        <p>No orders found.</p>
                      )}
                    </div>
                  )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}