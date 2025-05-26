import OrdersTable from "@/components/admin/orders/OrdersTable"
import { OrderColumns } from "./order-columns"
import { fetchAllOrders } from "@/actions/api"

export default async function OrdersPage() {
    const data = await fetchAllOrders()

    return(
        <section className="h-full px-8 py-4">
            <div>   
                <p>Track and manage customer orders</p>
            </div>
            <OrdersTable data={data} columns={OrderColumns}/>
        </section>
    )
}