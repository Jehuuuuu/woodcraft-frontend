'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

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

  const handlePrintReceipt = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Generate the receipt HTML content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - WoodCraft Order</title>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            margin: 0;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
          }
          .receipt-header h1 {
            margin-bottom: 5px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-weight: bold;
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #eee;
          }
          th {
            font-weight: bold;
          }
          .text-right {
            text-align: right;
          }
          .totals {
            margin-top: 20px;
            border-top: 1px solid #eee;
            padding-top: 10px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .grand-total {
            font-weight: bold;
            font-size: 1.2em;
            border-top: 1px solid #eee;
            padding-top: 10px;
            margin-top: 10px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 0.9em;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="receipt-header">
          <h1>WoodCraft</h1>
          <p>Order Receipt</p>
          <p>Order Reference: ${sessionId}</p>
          <p>Date: ${new Date(receipt?.created * 1000).toLocaleString()}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Customer Information</div>
          <p>${receipt?.customer_details?.name || 'N/A'}</p>
          <p>${receipt?.customer_details?.email || 'N/A'}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Items Purchased</div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th class="text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              ${receipt?.line_items?.data?.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td class="text-right">${formatCurrency(item.amount_total, receipt.currency)}</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>
        </div>
        
        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${formatCurrency(receipt?.amount_subtotal, receipt?.currency)}</span>
          </div>
          ${receipt?.total_details?.amount_shipping > 0 ? `
            <div class="total-row">
              <span>Shipping:</span>
              <span>${formatCurrency(receipt.total_details.amount_shipping, receipt.currency)}</span>
            </div>
          ` : ''}
          ${receipt?.total_details?.amount_tax > 0 ? `
            <div class="total-row">
              <span>Tax:</span>
              <span>${formatCurrency(receipt.total_details.amount_tax, receipt.currency)}</span>
            </div>
          ` : ''}
          <div class="total-row grand-total">
            <span>Total:</span>
            <span>${formatCurrency(receipt?.amount_total, receipt?.currency)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for your purchase!</p>
          <p>For any questions, please contact our customer support.</p>
        </div>
      </body>
      </html>
    `;
    
    // Write the content to the new window
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for the content to load before printing
    printWindow.onload = function() {
      printWindow.print();
      // Close the window after printing (optional)
      // printWindow.onafterprint = function() {
      //   printWindow.close();
      // };
    };
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
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Order Receipt</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrintReceipt}
                  disabled={!receipt}
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print Receipt
                </Button>
              </div>
              
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