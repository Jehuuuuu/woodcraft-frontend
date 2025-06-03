import ProductTable from "@/components/admin/products/ProductTable";
import { ProductColumns } from "./product-columns";
import { fetchCategories } from "@/actions/api";

export default async function ProductPage() {
    const categories = await fetchCategories();
   

    return(
        <section className="h-full px-8 py-4">
            <div className="mb-2">
                <p>Manage your products inventory</p>
            </div>
            <ProductTable categories={categories}/>
        </section>
    )
}