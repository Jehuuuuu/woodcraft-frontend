"use client"
import { MoreHorizontal, RollerCoaster } from "lucide-react"
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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"
import { mutate } from "swr"
export const CustomerDesignColumns = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0 !p-0" 
        >
          Customer
          <ArrowUpDown />
        </Button>
      )
    },
  },
  {
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className = "!px-0 "
          >
            Description
            <ArrowUpDown/>
          </Button>
        )
      },
    accessorKey: "design_description"
},
  {
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className = "!px-0 "
          >
            Dimensions
            <ArrowUpDown/>
          </Button>
        )
      },
    accessorKey: "dimensions"
},
  {
    accessorKey: "decoration_type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0"
        >
          Decoration Type
          <ArrowUpDown />
        </Button>
      )
    },
  },
  {
    accessorKey: "material",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0"
        >
          Material
          <ArrowUpDown />
        </Button>
      )
    },

  },
  {
    accessorKey: "estimated_price",
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
        const finalPrice = row.original.final_price;
        const estimatedPrice = row.getValue("estimated_price");
        const amount = parseFloat(finalPrice || estimatedPrice);
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "PHP",
        }).format(amount)
   
        return <div>{formatted}</div>
      },
  },
//   {
//     accessorKey: "image",
//     header: "Image",
//   },
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
    id: "actions",
    cell: ({ row }) => {
      // Convert this to a proper React component
      const ActionCell = () => {
        const design = row.original;
        const [message, setMessage] = useState('');
        const [finalPrice, setFinalPrice] = useState('');
        const [open, setOpen] = useState(false);
        const [open2, setOpen2] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const { setCsrfToken } = useAuthStore();

        const open3DModel = () => {
          if (design.model_url) {
            window.open(design.model_url, '_blank');
          } else {
            console.error('No 3D model URL available');
          }
        };
        
      const openImage = () => {
        if (design.model_image) {
          window.open(design.model_image, '_blank');
        } else {
          console.error('No image URL available');
        }
      };

      const approveDesign = async(design_id, final_price) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try{
            const csrfToken = await setCsrfToken();
            mutate('/admin/customer-designs', async(currentData) => {
              return currentData.map((item) => {
                return item.id === design_id ? {...item, status:'approved', final_price} : item
              })
            }, false)
            const response = await fetch (`${API_URL}/approve_design/${design_id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },
                credentials: "include",
                body: JSON.stringify({
                    final_price
                })
            })
            if (response.ok){
              mutate('/admin/customer-designs')
              toast.success("Design approved successfully.");
              setOpen(false); 
              return response;
            }else{
              mutate('/admin/customer-designs')
              toast.error("Error approving design.");
              throw new Error(response.statusText);        
            }
        }catch(error){
            mutate('/admin/customer-designs')
            console.error("Error approving design:", error);
            toast.error("Error approving design.");
        }
      }

      const rejectDesign = async(design_id, message) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setIsLoading(true);
        try{
            const csrfToken = await setCsrfToken();
            mutate('/admin/customer-designs', async (currentData) => {
              return currentData.map((item) => {
                return item.id === design_id 
                  ? {...item, status: 'rejected', message} 
                  : item;
              });
            }, false);
            const response = await fetch (`${API_URL}/reject_design/${design_id}`,
            { 
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },
                credentials: "include",
                body: JSON.stringify({
                    message
                })
            })
            if (response.ok){
              mutate('/admin/customer-designs')
              toast.success("Design rejected successfully.");
              setOpen2(false); 
              return response;
            }else{
              mutate('/admin/customer-designs')
              toast.error("Error rejecting design.");
              throw new Error(response.statusText);        
            }
        }catch(error){
            mutate('/admin/customer-designs')
            console.error("Error rejecting design:", error);
            toast.error("Error rejecting design.");
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
            {/* <DropdownMenuItem onClick={open3DModel}>View 3D Model</DropdownMenuItem>
            <DropdownMenuItem onClick={openImage}>View Image</DropdownMenuItem> */}
            <DropdownMenuSeparator />
            {design.status !== 'approved' && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild> 
                        <DropdownMenuItem onSelect = {(e) => e.preventDefault()}>Approve Design</DropdownMenuItem>
                    </DialogTrigger>
                
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Approve Design</DialogTitle>
                        <DialogDescription> 
                            Approve this customer's design and set the final price.
                        </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={async(e) => {
                            e.preventDefault();
                            await approveDesign(design.id, finalPrice);
                        }}>
                            <div className="mb-2">
                                <Label htmlFor='finalPrice'>Final Price</Label>
                                <Input 
                                    type='number'
                                    id='finalPrice'
                                    placeholder='Enter final price'
                                    className='mt-2'
                                    onChange={(e) => setFinalPrice(e.target.value)}
                                    required
                                />
                                <Button type="submit" variant="outline" className="mt-4 bg-primary text-white hover:bg-primary/90 hover:text-primary-foreground">
                                    Approve
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                    </Dialog>
                )}
            
            {design.status !== 'rejected' && (    
                <Dialog open={open2} onOpenChange={setOpen2}>
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e)=> e.preventDefault()}>Reject Design</DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reject Design</DialogTitle>
                            <DialogDescription>
                                Reject this customer's design and provide a message.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={ async (e) => {
                            e.preventDefault();
                            await rejectDesign(design.id, message)}
                            }>
                            <div className="mb-2">
                                <Label htmlFor='rejectionMessage'>Rejection Message</Label>
                                <Input
                                    type='text'
                                    id='rejectionMessage'
                                    placeholder='Enter rejection message'
                                    className='mt-2'
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                                <Button type="submit" variant="outline" className="mt-4 bg-primary text-white hover:bg-primary/90 hover:text-primary-foreground" disabled={isLoading}>
                                    {isLoading ? 'Rejecting...' : 'Reject'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
                )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
    return <ActionCell />;
  },
  }
]
