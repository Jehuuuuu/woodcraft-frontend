import ProductCatalog from "@/components/catalog/Products"
import { fetchCategories, fetchProducts } from "@/utils/api"

export default async function Catalog() {
    // Fetch data directly in the server component
    let categories = [];
    let products = [];
    
    try {
        categories = await fetchCategories();
        products = await fetchProducts();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    
    return (
        <div className="container px-8 py-6 bg-[var(--background)]">
            <ProductCatalog categories={categories} products={products} />
        </div>
    );
}