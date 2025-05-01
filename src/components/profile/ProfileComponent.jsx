"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SyncLoader } from "react-spinners";
import { User, Mail, Phone, MapPin, Edit, Save } from 'lucide-react';

export default function ProfileComponent() {
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });

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
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <SyncLoader
          color="#8B4513"
          loading={isLoading}
          size={12}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-24 pb-12 px-4  md:px-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-serif font-bold text-[#3c2415]">My Profile</CardTitle>
          <CardDescription>View and manage your personal information</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}