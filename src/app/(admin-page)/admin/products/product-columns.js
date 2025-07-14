"use client"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchCategories } from "@/actions/api"
import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"
import { mutate } from "swr"

export const ProductColumns = (categories) => [
  {
    accessorKey: "category_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0 !p-0" 
        >
          Category
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
            Name
            <ArrowUpDown/>
          </Button>
        )
      },
    accessorKey: "name"
},
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0"
        >
          Description
          <ArrowUpDown />
        </Button>
      )
    },
  },
  {
    accessorKey: "price",
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
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(amount)
 
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0"
        >
          Stock
          <ArrowUpDown />
        </Button>
      )
    },
  },
//   {
//     accessorKey: "image",
//     header: "Image",
//   },
  {
    accessorKey: "default_material",
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
    id: "actions",
    cell: ({ row }) => {
      const ActionCell = () => {
        const product = row.original;
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const {setCsrfToken} = useAuthStore();
        const [open, setOpen] = useState(false); 
        const [deleteOpen, setDeleteOpen] = useState(false); 
        // const [categories, setCategories] = useState([]);
        const [formData, setFormData] = useState({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          stock: product.stock || "",
          featured: product.featured || false,
          default_material: product.default_material || "oak",
          category_id: product.category_id || "",
          image: product.image || null,
        });
        
        // useEffect(() => {
        //   const getCategories = async () => {
        //     try {
        //       const fetchedCategories = await fetchCategories();
        //       setCategories(fetchedCategories);
        //     } catch (error) {
        //       console.error('Error fetching categories:', error);
        //     }
        //   };
        //   getCategories();
        // },[]);

        const handleInputChange = (e) => {
          const { id, value, type, checked } = e.target;
          setFormData((prev) => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value,
          }));
        };
      
        const handleFileChange = (e) => {
          setFormData((prev) => ({
            ...prev,
            image: e.target.files[0],
          }));
        };
        const handleEdit = async(product_id) => {
          const csrfToken = await setCsrfToken();
          const form = new FormData();
          Object.keys(formData).forEach((key) => {
            if (formData[key] !== undefined && formData[key] !== null) {
              form.append(key, formData[key]);
            }
          });
          form.append('product_id', product_id);
          console.log("FormData contents:", Array.from(form.entries())); 
          const response = await fetch(`${API_URL}/edit_product/${product_id}`, {
            method: "POST",
            headers: {
              "X-CSRFToken": csrfToken
            },
            body: form,
            credentials: "include",
          })
          setOpen(false);
          if(response.ok){
            Promise.all([
              mutate('/admin/products'),
              mutate('/catalog'),
            ]);
            toast.success("Product edited successfully");
          }else{
            toast.error("Error editing product.")
            console.error(response.status)
          }
        }
        const handleDelete = async(product_id) => {
          const csrfToken = await setCsrfToken();
          try{
          const response = await fetch(`${API_URL}/delete_product/${product_id}`, {
            method:"DELETE",
            headers: {
              'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({product_id:product_id}),
            credentials:"include"
          })
            console.log(response)
            setDeleteOpen(false);
            Promise.all([
              mutate('/admin/products'),
              mutate('/catalog'),
            ]);
            if(response.ok){
             toast.success("Product deleted successfully");
            }else{
              toast.error("Error deleting product.")
              console.error(response.status)
            }
          }catch(error){
            mutate('/admin/products');
            toast.error("Error deleting product. Please try again later.")
            console.error("Error deleting product:", error)
          }
        }

        return (
          <DropdownMenu modal = {false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Dialog open={open} onOpenChange = {setOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View/Edit Product</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  
                  <DialogHeader>
                    <DialogTitle>View/Edit Product</DialogTitle>
                  </DialogHeader>
                  <DialogDescription className="pt-2">
                    View more or edit the details of the product.
                  </DialogDescription>
                  <div className="space-y-4 py-4">
                    <div className="flex gap-4">
                        <Label
                          htmlFor="name"
                          className="w-[25%]"
                        >Product Name </Label>
                        <Input
                          id="name"
                          placeholder="Product Name"
                          className="mt-1 w-[75%]"
                          defaultValue={product.name}
                          onChange = {handleInputChange}
                        />
                      </div>
                    
                      <div className="flex gap-4">
                        <Label
                          htmlFor="category_id"
                          className="w-[25%]"
                        >Category </Label>
                        <Select id="category_id" onValueChange={value => handleInputChange({ target: { id: "category_id", value } })} >
                          <SelectTrigger className="w-[75%]">
                            <SelectValue placeholder={product.category_name}/>
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => {
                              return (
                                <SelectItem key = {category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    
                      <div className="flex gap-4">
                        <Label
                          htmlFor="description"
                          className="w-[25%]"
                        >Description </Label>
                        <Input
                          id="description"
                          placeholder="Description"
                          className="mt-1 w-[75%]"
                          defaultValue={product.description}
                          onChange = {handleInputChange}
                        />
                      </div>
                    
                      <div className="flex gap-4">
                        <Label
                          htmlFor="price"
                          className="w-[25%]"
                        >Price </Label>
                        <Input
                          id="price"
                          placeholder="Price"
                          type="number"
                          step="0.01"
                          className="mt-1 w-[75%]"
                          defaultValue={product.price}
                          onChange = {handleInputChange}
                        />
                      </div>
                    
                      <div className="flex gap-4">
                        <Label
                          htmlFor="stock"
                          className="w-[25%]"
                        >Stock </Label>
                        <Input
                          id="stock"
                          placeholder="Stock"
                          type="number"
                          className="mt-1 w-[75%]"
                          defaultValue={product.stock}
                          onChange = {handleInputChange}
                        />
                      </div>
                    
                      <div className="flex gap-4">
                        <Label
                          htmlFor="featured"
                          className="w-[25%]"
                        >Featured </Label>
                        <Input
                          id="featured"
                          type="checkbox"
                          className="mt-1 h-4 w-4"
                          checked={product.featured ? "checked" : ""}
                          onChange = {handleInputChange}
                        />
                      </div>
                    
                      <div className="flex gap-4">
                        <Label
                          htmlFor="image"
                          className="w-[25%]"
                        >Image </Label>
                        <Input
                          id="image"
                          type="file"
                          className="mt-1 w-[75%]"
                          onChange={handleFileChange}
                        />
                      </div>
                    
                      <div className="flex gap-4">
                        <Label
                          htmlFor="default_material"
                          className="w-[25%]"
                        >Default Material </Label>
                        <Input
                          id="default_material"
                          placeholder="Default Material"
                          defaultValue={product.default_material}
                          className="mt-1 w-[75%]"
                          onChange = {handleInputChange}
                        />
                      </div>
                  </div>
                  <DialogFooter>
                  <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
                    <Button type="submit" onClick={() => handleEdit(product.id)}>Save changes</Button>
                  </DialogFooter>
               
                </DialogContent>
              </Dialog>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e)=> e.preventDefault()}>Delete Product</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Product</DialogTitle>
                  </DialogHeader>
                  <div>Are you sure you want to delete the product "{product.name}"? This action cannot be undone.</div>
                  <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" variant="destructive" onClick={() => handleDelete(product.id)}>Delete</Button>
            </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}   
        return <ActionCell />
    },
  },

]
