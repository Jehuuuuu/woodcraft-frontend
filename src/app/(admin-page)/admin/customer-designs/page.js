import { fetchCustomerDesigns } from "@/actions/api"
import CustomerDesignsTable from "@/components/admin/customer-designs/page";
import { CustomerDesignColumns } from "./customer-designs-columns";
export default async function CustomerDesignsPage() {
    const data = await fetchCustomerDesigns();
    return(
        <section className="h-full px-8 py-4">
            <div className="mb-2">
                <p>Approve or reject customers' custom designs</p>
            </div>
            <CustomerDesignsTable columns={CustomerDesignColumns} data={data}/>
        </section>
    )
}