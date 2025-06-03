import ProductCatalog from "@/components/catalog/Products"

export default function Catalog() {
    // let categories = [];
    // let products = [];
    
    // try {
    //     categories = await fetchCategories();
    //     products = await fetchProducts();
    // } catch (error) {
    //     console.error('Error fetching data:', error);
    // }
    
    return (
        <div className="container px-8 py-22 bg-[var(--background)]">
            <ProductCatalog />
        </div>
    );
}