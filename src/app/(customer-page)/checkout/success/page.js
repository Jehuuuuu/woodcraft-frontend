'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { Suspense } from 'react';
export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  // const { clearCart } = useAuthStore.getState(); 

  // useEffect(() => {
  //   if (sessionId) {
  //     toast.success('Payment successful! Thank you for your order.');
  //     // Optionally, you can verify the session on your backend here for extra security
  //     // and then clear the cart or update order status.
  //     // For simplicity, we might rely on webhooks for fulfillment.
  //     // clearCart(); // Example: if you want to clear the cart on frontend
  //     useAuthStore.getState().getCartItems(); // Refresh cart items, which should be empty
  //   }
  // }, [sessionId]);

  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="text-lg mb-6">Thank you for your purchase. Your order is being processed.</p>
      <Suspense fallback={<div>Loading...</div>}>
      {sessionId && <p className="text-sm text-gray-500 mb-8">Session ID: {sessionId}</p>}
      </Suspense>
      <Link href="/" legacyBehavior>
        <a className="bg-[var(--primary-color)] text-white px-6 py-3 rounded hover:bg-[var(--secondary-color)]">
          Continue Shopping
        </a>
      </Link>
    </div>
  );
}