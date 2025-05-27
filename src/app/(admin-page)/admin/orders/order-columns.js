"use client"
import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"

export const OrderColumns= [
  {
    accessorKey: "order_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0 !p-0" 
        >
          ID
          <ArrowUpDown />
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className = "!px-0 "
          >
            Customer
            <ArrowUpDown/>
          </Button>
        )
      },
},
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0"
        >
          Customer Email
          <ArrowUpDown />
        </Button>
      )
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0"
        >
          Address
          <ArrowUpDown />
        </Button>
      )
    },
  },
  
  {
    accessorKey: "total_price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0"
        >
          Price
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: row.getValue("currency"),
      }).format(amount)
 
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "currency",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0"
        >
          Currency
          <ArrowUpDown />
        </Button>
      )
    },
  },
  {
    accessorKey: "date_ordered",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0"
        >
          Date
          <ArrowUpDown />
        </Button>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0"
        >
          Status
          <ArrowUpDown />
        </Button>
      )
    },
  },
  {
    accessorKey: "items",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0"
        >
          Items
          <ArrowUpDown />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // Convert this to a proper React component
      const ActionCell = () => {
        const order = row.original;
        const [open, setOpen] = useState(false);
        const [itemsOpen, setItemsOpen] = useState(false); // Add state for items dialog
        const [status, setStatus] = useState(order.status);
        const { setCsrfToken } = useAuthStore();
        const router = useRouter();
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        
        const updateStatus = async (order_id) => {
          try{
            const csrfToken = await setCsrfToken()
            const response = await fetch(`${API_URL}/update_order_status/${order_id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
              },
              credentials: "include",
              body: JSON.stringify({ status }),
            })
            if (response.ok){
              setOpen(false); 
              router.push('/admin/orders');
              toast.success("Order status updated successfully.");
              return response;
            }else{
                toast.error("Error approving design.");
                throw new Error(response.statusText);        
            }
          }catch(error){
            console.error("Error updating status:", error)
            toast.error("Error updating status. Please try again later.")
          }
        }
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Dialog open={itemsOpen} onOpenChange={setItemsOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View Order Items</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Order #{order.order_id} Items</DialogTitle>
                    <DialogDescription>
                      Items included in this order
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.product_name || item.customer_design}</h4>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              <p className="text-sm text-gray-600">Unit Price: {order.currency} {item.price}</p>
                            </div>
                            {item.design_image && (
                              <div className="ml-4">
                                <img 
                                  src={item.design_image} 
                                  alt={item.design_name || 'Design'}
                                  className="w-20 h-20 object-cover rounded"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-8">No items found for this order</p>
                    )}
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Order Total:</span>
                      <span>{order.currency} {parseFloat(order.total_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect = {(e) => e.preventDefault()}>Update Order Status</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle> Update Order #{order.order_id} Status</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                   Update the order status to reflect the current state of the order.
                  </DialogDescription>
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    await updateStatus(order.order_id)
                  }}>
                    <Select onValueChange = {(value) => setStatus(value)} className="w-full">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder = {status.toUpperCase()}></SelectValue>
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value="pending">PENDING</SelectItem>
                          <SelectItem value="processing">PROCESSING</SelectItem>
                          <SelectItem value="shipped">SHIPPED</SelectItem>
                          <SelectItem value="delivered">DELIVERED</SelectItem>
                          <SelectItem value="cancelled">CANCELLED</SelectItem>
                        </SelectContent>
                      </Select>
                      <DialogFooter>
                      <Button variant="outline" className="mt-4 bg-primary text-white hover:bg-primary/90 hover:text-primary-foreground" type="submit" >Update</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
      
      return <ActionCell />;
    },
  },
]
