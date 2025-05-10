import { DataTable } from "@/components/admin/dashboard/data-table";
import { columns } from "../customers/product-columns";
import { fetchProducts } from "@/actions/api";

export default async function ProductPage() {
    const data = await fetchProducts();
    return(
        <section className="h-full px-8 py-4">
            <div className="mb-4">
                <p>Manage your products inventory</p>
            </div>
                <DataTable columns={columns} data={data} />
           
        </section>
    )
}