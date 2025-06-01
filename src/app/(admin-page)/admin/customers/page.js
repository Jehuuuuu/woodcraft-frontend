import CustomerTable from "@/components/admin/customers/CustomerTable";
import { CustomerColumns } from "./customer-columns";

export default function CustomerPage() {
    return(
        <section className="h-full px-8 py-4">
            <div>
                <p>Manage your customer database</p>
            </div>
            <CustomerTable columns={CustomerColumns}/>
        </section>
    )
}