"use client"
import { fetchCategories, fetchProducts } from '@/actions/api';
import useSWR from 'swr';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
export default function FeaturedProducts() {
  // const {data:categories, categoriesError, isCategoriesLoading} = useSWR(`api/categories`, async() => {
  //   try{
  //     const categories = await fetchCategories();
  //     return categories;
  //    }catch(error){
  //     console.error("Error fetching orders:", error);
  //     return []; 
  //   }
  // });
  const {data:products, productsError, isProductsLoading} = useSWR(`api/catalog`, async() => {
    try{
      const products = await fetchProducts();
      return products;
     }catch(error){
      console.error("Error fetching orders:", error);
      return []; 
  } 
  });
  if(isProductsLoading){
    return(
      <div className='flex items-center justify-center gap-4'>
        <Skeleton
        width={200}
        height={200}
        />
        <Skeleton
        width={200}
        height={200}
        />
        <Skeleton
        width={200}
        height={200}
        />
      </div>
    )
  }
  if(productsError){
    return(
      <div className="flex justify-center items-center h-screen bg-[var(--background)]">
        <p>Error loading categories or products</p>
      </div>
    )
  }

  return (
    <section className="py-16 px-8 md:px-16 bg-[#f8f6f2]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
        <span className="inline-block px-4 py-1 bg-[#f0e6d9] text-[#8B4513] rounded-full text-sm mb-4">Our Collection</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3c2415] mb-4">Featured Woodcraft Masterpieces</h2>
          <p className="text-[var(--muted-text)] max-w-2xl mx-auto">
            Discover our most popular handcrafted pieces, each telling a story of artisanal excellence and timeless design.
          </p>
        </div>

        {/* <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-1 md:space-x-2 md:flex-nowrap">
            {Array.isArray(categories) && categories.map((category) => {
              return(
                <button key={category.id} className="bg-white text-[var(--muted-text)] border border-[var(--accent-color)] px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base hover:bg-[var(--primary-color)] hover:text-white w-full sm:w-auto mb-2 sm:mb-0 max-w-[150px] sm:max-w-none">{category.name}</button>
              )
            })}
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.isArray(products) && products.filter(product => product.featured).map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-64 bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <Image
                    src={product.image ? `https://woodcraft-backend.onrender.com${product.image}` : "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-[#3c2415] mb-2">{product.name}</h3>
                <p className="text-[#8B4513] font-bold">${product.price}</p>
              </div>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}