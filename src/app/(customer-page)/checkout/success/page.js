'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionId) {
      fetchReceiptData();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const fetchReceiptData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stripe/session?session_id=${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch receipt data');
      }
      
      const data = await response.json();
      setReceipt(data);
    } catch (err) {
      console.error('Error fetching receipt:', err);
      setError('Unable to load your receipt. Please contact customer support.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'PHP',
    }).format(amount / 100); // Stripe amounts are in cents
  };

  return (
    <div className="container mx-auto py-25 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-lg mb-6">Thank you for your purchase. Your order is being processed.</p>
          {sessionId && <p className="text-sm text-gray-500 mb-2">Order Reference: {sessionId}</p>}
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p>Loading your receipt...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        ) : receipt ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Order Receipt</h2>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Customer Information</h3>
                <p>{receipt.customer_details?.name || 'N/A'}</p>
                <p>{receipt.customer_details?.email || 'N/A'}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Items Purchased</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receipt.line_items?.data?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.amount_total, receipt.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Subtotal:</span>
                  <span>{formatCurrency(receipt.amount_subtotal, receipt.currency)}</span>
                </div>
                {receipt.total_details?.amount_shipping > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Shipping:</span>
                    <span>{formatCurrency(receipt.total_details.amount_shipping, receipt.currency)}</span>
                  </div>
                )}
                {receipt.total_details?.amount_tax > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Tax:</span>
                    <span>{formatCurrency(receipt.total_details.amount_tax, receipt.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-bold text-lg mt-2 pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatCurrency(receipt.amount_total, receipt.currency)}</span>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>Payment Status: {receipt.payment_status}</p>
                <p>Payment Method: {receipt.payment_method_types?.join(', ') || 'Card'}</p>
                <p>Date: {new Date(receipt.created * 1000).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-8">
            <p>No receipt information available.</p>
          </div>
        )}
        
        <div className="flex gap-2 justify-center text-center mt-6">
          <Link href="/" legacyBehavior>
            <a className="bg-[var(--white)] text-[var(--primary-color)] border border-[var(--orimary-color)] px-6 py-3 rounded hover:bg-[var(--white)]/30">
              Back to Home
            </a>
          </Link>
          <Link href="/catalog" legacyBehavior>
            <a className="bg-[var(--primary-color)] text-white px-6 py-3 rounded hover:bg-[var(--secondary-color)]">
              Continue Shopping
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <CheckoutSuccess />
    </Suspense>
  );
}