import CustomerDesignsTable from "@/components/admin/customer-designs/CustomerDesignsTable";
import { CustomerDesignColumns } from "./customer-designs-columns";
export default async function CustomerDesignsPage() {
    return(
        <section className="h-full px-8 py-4">
            <div className="mb-2">
                <p>Approve or reject customers' custom designs</p>
            </div>
            <CustomerDesignsTable columns={CustomerDesignColumns}/>
        </section>
    )
}