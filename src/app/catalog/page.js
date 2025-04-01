"use client"
import {fetchCategories, fetchProducts} from "@/utils/api"
import {useEffect, useState} from "react"
import {toast} from "sonner"
import ProductCatalog from "@/components/catalog/Products"

export default function Catalog() {
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try{
                const categories = await fetchCategories()
                const products = await fetchProducts()
                setCategories(categories)
                setProducts(products)
            }catch(error){
                console.error('Error fetching', error);
                toast.error('Error fetching products', error);
            }
        }
        fetchData(); 
    }, []);
    
    return (
   <div className="container px-8 py-6 bg-[var(--background)]">
        <ProductCatalog categories={categories} products={products} />
    </div>
);
}