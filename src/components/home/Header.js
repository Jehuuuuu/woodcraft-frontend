"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import {toast} from 'sonner'
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const {user, isAuthenticated, logout, fetchUser, totalCartItems, getCartItems} = useAuthStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      await fetchUser(); 
      await getCartItems(); 
      setIsLoading(false);
    };
    loadUserData();
  }, [fetchUser, getCartItems]); 

  const handleLogout = async () => {
    try{
      await logout();
      router.back();
      toast.success('You have been logged out successfully');
    }catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to logout. Please try again.');
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  }


  return (
    <header className="fixed z-50 w-full flex justify-between items-center py-4 px-8 md:px-16 bg-white shadow-sm"> {/* Adjusted z-index and added shadow */}
      <div className="flex items-center">
        <Link href="/" className="text-[#8B4513] font-serif">
          <h1 className="text-xl md:text-2xl font-bold">Hufano <span className="font-light">Handicraft</span></h1>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex space-x-6">
        <Link href="/catalog" className="text-gray-700 hover:text-[#8B4513]">Catalog</Link>
        <Link href="/configurator" className="text-gray-700 hover:text-[#8B4513]">3D Configurator</Link>
        <Link href="/about" className="text-gray-700 hover:text-[#8B4513]">About</Link>
        <Link href="/contact" className="text-gray-700 hover:text-[#8B4513]">Contact</Link>
      </nav>

      <div className="flex items-center space-x-4">
        <Link href="/cart" className="text-gray-700 hover:text-[#8B4513]">
          <div className="relative">
            <ShoppingCart />
            {isLoading ? (
              <span className="absolute -top-2 -right-2 bg-gray-300 animate-pulse rounded-full h-4 w-5"></span>
            ) : (
              <span className="absolute -top-2 -right-2 bg-[#8B4513] text-white text-xs rounded-full h-4 w-5 flex items-center justify-center">{totalCartItems}</span>
            )}
          </div>
        </Link>
        <div className="relative">
          <Link href="/profile" className="text-gray-700 hover:text-[#8B4513]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
        <div className="hidden lg:flex items-center gap-4 ">
          {isLoading ? (
            <>
              <div className="h-5 w-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-10 w-20 bg-gray-300 rounded animate-pulse"></div>
            </>
          ) : (
            <>
              <p>{user !== null && isAuthenticated ? `Welcome, ${user.firstName}`: ""}</p>
              {user !== null ? (
                <Link href="#" className="bg-[var(--primary-color)] text-white px-4 py-2 rounded hover:bg-[var(--secondary-color)] transition-colors" onClick={handleLogout}>
                  Logout
                </Link>
              ) : (
                <Link href="/login" className="bg-[var(--primary-color)] text-white px-4 py-2 rounded hover:bg-[var(--secondary-color)] transition-colors">
                  Login
                </Link>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-700 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white lg:hidden"> {/* Adjusted z-index */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <Link href="/" className="text-[#8B4513] font-serif" onClick={() => setMobileMenuOpen(false)}>
              <h1 className="text-xl font-bold">Hufano <span className="font-light">Handicraft</span></h1>
            </Link>
            <button className="text-gray-700 focus:outline-none" onClick={toggleMobileMenu}>
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex flex-col p-4 space-y-4">
            <Link href="/catalog" className="py-2 text-gray-700 hover:text-[#8B4513]" onClick={() => setMobileMenuOpen(false)}>Catalog</Link>
            <Link href="/configurator" className="py-2 text-gray-700 hover:text-[#8B4513]" onClick={() => setMobileMenuOpen(false)}>3D Configurator</Link>
            <Link href="/about" className="py-2 text-gray-700 hover:text-[#8B4513]" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link href="/contact" className="py-2 text-gray-700 hover:text-[#8B4513]" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          </nav>
          
          {/* Mobile Login/Logout Skeleton */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200"> {/* Added border */}
            {isLoading ? (
              <div className="h-12 w-full bg-gray-300 rounded animate-pulse"></div>
            ) : (
              <>
                {user !== null && isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-[#8B4513] text-white py-3 rounded text-center font-medium"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full bg-[#8B4513] text-white py-3 rounded text-center font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

