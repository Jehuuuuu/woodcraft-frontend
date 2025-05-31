import OrdersTable from "@/components/admin/orders/OrdersTable"
import { OrderColumns } from "./order-columns"

export default function OrdersPage() {
    return(
        <section className="h-full px-8 py-4">
            <div>   
                <p>Track and manage customer orders</p>
            </div>
            <OrdersTable columns={OrderColumns}/>
        </section>
    )
}