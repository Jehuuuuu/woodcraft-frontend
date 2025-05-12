// src/app/checkout/cancel/page.js
'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function CheckoutCancelPage() {
  useEffect(() => {
    toast.error('Payment was cancelled.');
  }, []);

  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
      <p className="text-lg mb-6">Your payment was not completed. Your cart has not been changed.</p>
      <Link href="/cart" legacyBehavior>
        <a className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 mr-4">
          Return to Cart
        </a>
      </Link>
      <Link href="/" legacyBehavior>
        <a className="bg-[var(--primary-color)] text-white px-6 py-3 rounded hover:bg-[var(--secondary-color)]">
          Continue Shopping
        </a>
      </Link>
    </div>
  );
}