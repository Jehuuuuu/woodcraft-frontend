"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import Image from "next/image"
import { Button } from "../ui/button"
import { useState } from "react"
import { Plus, Minus, Star, StarHalf } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"

export default function ProductDialog({product, category, open, onOpenChange}){
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const {user, setCsrfToken,} = useAuthStore()
  const router = useRouter()

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1)
  }
  
 const addToCart = async (user, product_id, quantity) => {
    try {
        setLoading(true)
        const token = await setCsrfToken();
        const response = await fetch("https://woodcraft-backend.onrender.com/api/add_to_cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": token
            },
            credentials: "include", 
            body: JSON.stringify({
                user,
                product_id,
                quantity
            })
        })
        
        const data = await response.json()
        toast.success(`Added ${quantity} of ${product?.name} to cart`);
        await useAuthStore.getState().getCartItems();
    } catch (error) {
        console.error("Error adding to cart:", error)
        toast.error(`Error adding to cart: ${error.message}`)
    } finally {
        setLoading(false)
    }
  }
  const sampleReviews = [
    {
      id: 1,
      name: "Maria Santos",
      rating: 5,
      date: "2023-11-15",
      comment: "Absolutely beautiful craftsmanship! The wood grain is stunning and the finish is perfect. Exactly what I was looking for."
    },
    {
      id: 2,
      name: "Juan Reyes",
      rating: 4,
      date: "2023-10-28",
      comment: "Great quality product. The color is slightly different from what I expected, but still looks amazing in my living room."
    },
    {
      id: 3,
      name: "Ana Gomez",
      rating: 5,
      date: "2023-09-12",
      comment: "Exceptional quality and attention to detail. The woodwork is flawless and the piece arrived earlier than expected."
    }
  ];

  const averageRating = sampleReviews.reduce((acc, review) => acc + review.rating, 0) / sampleReviews.length;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400" size={16} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-yellow-400 text-yellow-400" size={16} />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-gray-300" size={16} />);
    }
    
    return stars;
  };

 return(
        <Dialog open={open} onOpenChange={onOpenChange} >
        <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] max-h-[75vh] overflow-y-auto">
            <DialogHeader>
            <DialogTitle>{product?.name}</DialogTitle>
                <p className="text-sm text-muted">{category}</p>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Image
                    src = {product?.image ? `https://woodcraft-backend.onrender.com${product?.image}` : "/placeholder.svg"}
                    alt = {product?.name}
                    width={400}
                    height={50}
                    className="rounded-lg"
                    >
                    </Image>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl">₱ {product?.price}</h2>
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(averageRating)}
                      <span className="text-sm text-gray-500 ml-1">({sampleReviews.length} reviews)</span>
                    </div>
                    <p>{product?.description}</p>
                    <p>Materials: {product?.default_material}</p>
                    
                    {/* Quantity selector */}
                    <div className="flex items-center gap-2 my-2">
                      <span className="text-sm font-medium">Quantity:</span>
                      <div className="flex items-center border rounded-md">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-r-none"
                          onClick={decrementQuantity}
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="w-10 text-center">{quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-l-none"
                          onClick={incrementQuantity}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                    {loading && <p className="text-sm text-gray-500">Adding to cart...</p>}
                    <Button 
                      variant="outline" 
                      className="mt-auto bg-[var(--primary-color)] text-white"
                      disabled={loading}
                      onClick={() => {
                        if (user === null){
                          toast.error("Please login to add items to cart");
                          router.push("/login");
                        } else {
                          addToCart(user?.id, product?.id, quantity);
                          if(loading === false){
                            onOpenChange();
                          }
                          setQuantity(1);
                        }
                      }}
                    >
                      {loading ? "Adding..." : "Add to Cart"}
                    </Button>
                </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Customer Reviews</h3>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {renderStars(averageRating)}
                </div>
                <span className="ml-2 text-sm text-gray-500">Based on {sampleReviews.length} reviews</span>
              </div>
              
              <div className="space-y-4 max-h-[200px] overflow-y-auto">
                {sampleReviews.map(review => (
                  <div key={review.id} className="border-b pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{review.name}</p>
                        <div className="flex items-center mt-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
        </DialogContent>
        </Dialog>
 )
}