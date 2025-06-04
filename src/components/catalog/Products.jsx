"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Eye, ShoppingCart } from 'lucide-react';
import ProductDialog from './ProductDialog';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetchCategories, fetchProducts } from '@/actions/api';
import { SyncLoader } from 'react-spinners';


export default function ProductCatalog() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0]);
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const {user, setCsrfToken} = useAuthStore();
  const maxPrice = 10000; 
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const {data:categories, categoriesError, isCategoriesLoading} = useSWR(`/categories`, async() => {
    try{
      const categories = await fetchCategories();
      return categories || [];
     }catch(error){
      console.error("Error fetching orders:", error);
      return []; 
    }
  });
  const {data:products, productsError, isProductsLoading} = useSWR(`/catalog`, async() => {
    try{
      const products = await fetchProducts();
      setIsLoading(false);
      return products;
     }catch(error){
      console.error("Error fetching orders:", error);
      return []; 
  } 
  });

  useEffect(() => {
    if (!Array.isArray(products)) return;
    
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    if (selectedMaterial.length > 0) {
      filtered = filtered.filter(product =>
        selectedMaterial.includes(product.default_material)
      );
    }

    if (priceRange[0] > 0) {
      filtered = filtered.filter(product => 
        parseFloat(product.price) >= (priceRange[0] / 100) * maxPrice
      );
    }
    
    if (inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }
    
    if (onSale) {
      filtered = filtered.filter(product => product.originalPrice);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        (product.name && product.name.toLowerCase().includes(query)) || 
        (product.category && product.category.name && product.category.name.toLowerCase().includes(query))
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategories, priceRange, inStock, onSale, searchQuery, selectedMaterial, products]);
  
  if(isLoading || isCategoriesLoading || isProductsLoading){
    return(
      <div className="flex justify-center items-center h-screen bg-[var(--background)]">
      <SyncLoader color="#8B4513" size={12} />
      </div>
    )
  }
  if(categoriesError || productsError){
    return(
      <div className="flex justify-center items-center h-screen bg-[var(--background)]">
        <p>Error loading categories or products</p>
      </div>
    )
  }

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleMaterial = (material) => {
    setSelectedMaterial(prev =>
      prev.includes(material)
       ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  }
  
  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0]);
    setInStock(false);
    setOnSale(false);
    setSearchQuery('');
  };
  
  const handleAddToCart = async (user, product_id, quantity) => {
    try{
      if(!user){
        toast.error("Please login to add to cart");
        router.push("/login");
        return;
      }
      const csrfToken = await setCsrfToken();
      const response =  await fetch(`${apiURL}/add_to_cart`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
          user, product_id, quantity
        })
      })
      toast.success("Product added to cart");
      await useAuthStore.getState().getCartItems();
    }catch(error){
      console.error("Error adding to cart:", error);
      toast.error("Error adding to cart. Please try again");
    }
  }
  
  return (
      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile filter toggle */}
        <div className="gap-2 md:hidden flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="border-gray-300"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Input 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-[300px] "
          />
        </div>

        {/* Sidebar filters */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-64 flex-shrink-0`}>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center md:hidden">
              <h1 className="text-lg font-medium">Filters</h1>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X size={18} />
              </Button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-base font-medium mb-2">Price Range</h3>
              <div className="flex flex-col">
                <Slider 
                  value={priceRange} 
                  onValueChange={setPriceRange} 
                  max={100} 
                  step={1} 
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>₱0</span>
                  <span>₱{maxPrice}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-base font-medium mb-2">Categories</h3>
              <div className="space-y-2">
                <div 
                  className={`cursor-pointer py-1 px-2 rounded hover:bg-gray-100 ${
                    selectedCategories.length === 0 ? 'bg-gray-100 font-medium' : ''
                  }`}
                  onClick={() => setSelectedCategories([])}
                >
                  All
                </div>
                {Array.isArray(categories) && categories.map(category => (
                  <div 
                    key={category.id} 
                    className={`cursor-pointer py-1 px-2 rounded hover:bg-gray-100 ${
                      selectedCategories.includes(category.id) ? 'bg-gray-100 font-medium' : ''
                    }`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-base font-medium mb-2">Materials</h3>
              <div className="space-y-2">
        {["Oak", "Walnut", "Maple", "Pine", "Mahogany"].map(material => (
          <div 
            key={material} 
            className={`cursor-pointer py-1 px-2 rounded hover:bg-gray-100 ${
              selectedMaterial.includes(material) ? 'bg-gray-100 font-medium' : ''
            }`}
            onClick={() => toggleMaterial(material)}
          >
            {material}
          </div>
        ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="inStock" className="text-base font-medium cursor-pointer">
                  In Stock Only
                </label>
                <Switch id="inStock" checked={inStock} onCheckedChange={setInStock} />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="onSale" className="text-base font-medium cursor-pointer">
                  On Sale
                </label>
                <Switch id="onSale" checked={onSale} onCheckedChange={setOnSale} />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-6 border-gray-300"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {/* Desktop search and view options */}
          <div className="hidden md:flex items-center mb-6">
            <Input 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[100%] mr-4"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grid"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" /></svg>
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3" y1="6" y2="6" /><line x1="3" x2="3" y1="12" y2="12" /><line x1="3" x2="3" y1="18" y2="18" /></svg>
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">Showing {filteredProducts.length} products</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group relative p-5 rounded-lg overflow-hidden transition-all duration-300 ease-in-out bg-white hover:shadow-md"
                onMouseEnter={() => setHoveredProductId(product.id)}
                onMouseLeave={() => setHoveredProductId(null)}
              >
                <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={product.image ? `https://woodcraft-backend.onrender.com${product.image}` : "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {product.isNew && (
                    <Badge className="absolute top-2 left-2 bg-[#8B4513] text-white">
                      New
                    </Badge>
                  )}
                  
                  {product.discount && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                      {product.discount}% Off
                    </Badge>
                  )}
                  
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-2 right-2 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-white ${
                      favorites.includes(product.id) ? 'text-[var(--primary-color)]' : 'text-gray-700'
                    }`}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart className={favorites.includes(product.id) ? 'fill-current' : ''} size={20} />
                  </Button> */}
                </div>
                <div 
                  className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${
                    hoveredProductId === product.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className='mb-10 flex gap-2'>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full h-10 w-10"
                      onClick={()=> {
                        setSelectedProduct(product)
                        setSelectedCategory(categories.find((category)=> category.id === product.category)?.name)
                        setIsOpen(true)
                      }}

                    >
                        <Eye className="h-10 w-5" />
                      <span className="sr-only">Quick view</span>
                    </Button>
                    
                        <Button
                      size="icon"
                      className="rounded-full h-10 w-10 bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90"
                      onClick={() => {
                          handleAddToCart(user?.id, product?.id, 1)
                      }}
                      disabled={inStock === 0}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span className="sr-only">Add to cart</span>
                    </Button>
                  </div>
                </div>
               
                <div className="mt-3">
                  <Badge variant="outline">{categories.find((category)=> category.id === product.category)?.name}</Badge>
                  <Link href={`/product/${product.id}`} className="mt-1 block">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  </Link>
                  <div className="mt-1 flex items-center">
                    <span className="text-lg font-bold text-[#8B4513]">₱{parseFloat(product.price).toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ₱{parseFloat(product.originalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                  {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                    <p className="mt-1 text-sm text-amber-600">Only {product.stock} left in stock</p>
                  )}
                </div>
                
              </div>
            ))}
           
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-gray-500">No products found</p>
              <p className="text-sm text-gray-400">Try adjusting your filters</p>
            </div>
          )}
          <ProductDialog
            product={selectedProduct}
            category={selectedCategory}
            open={isOpen}
            onOpenChange={setIsOpen}
              /> 
        </div>
      </div>
  );
}