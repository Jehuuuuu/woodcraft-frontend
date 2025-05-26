import ProductTable from "@/components/admin/products/ProductPage";
import { ProductColumns } from "./product-columns";
import { fetchProducts } from "@/actions/api";

export default async function ProductPage() {
    const data = await fetchProducts();
    return(
        <section className="h-full px-8 py-4">
            <div className="mb-2">
                <p>Manage your products inventory</p>
            </div>
            <ProductTable columns={ProductColumns} data={data}/>
        </section>
    )
}