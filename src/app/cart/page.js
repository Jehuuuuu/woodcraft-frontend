import CartItems from "@/components/cart/CartItems";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CartPage() {
  return (
    <div className="container py-22 px-8 bg-[var(--background)] lg:px-16">
      <div className="max-w-6xl mx-aut  o">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-[#3c2415]">Shopping Cart</h1>
          <p className="text-gray-600">Review and manage your selected items</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <CartItems />
          </div>
          
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-medium text-[#3c2415] mb-2">Have a Promo Code?</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                  />
                  <Button variant="outline">Apply</Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-[#3c2415] mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our customer service team is here to help you with any questions about your order.
                </p>
                <Button variant="outline" className="w-full">Contact Support</Button>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-[#3c2415] mb-2">Continue Shopping</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/catalog" passHref>
                    <Button variant="outline" className="w-full">
                      Browse Catalog
                    </Button>
                  </Link>
                  <Link href="/" passHref>
                    <Button variant="outline" className="w-full">
                      Home Page
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}