import ProductCatalog from "@/components/catalog/Products"
import { fetchCategories, fetchProducts } from "@/actions/api"

export default async function Catalog() {
    let categories = [];
    let products = [];
    
    try {
        categories = await fetchCategories();
        products = await fetchProducts();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    
    return (
        <div className="container px-8 py-22 bg-[var(--background)]">
            <ProductCatalog categories={categories} products={products} />
        </div>
    );
}