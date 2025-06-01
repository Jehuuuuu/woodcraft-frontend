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

export const ProductColumns= [
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
      const product = row.original;
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
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View/Edit Product</DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <form>
                <DialogHeader>
                  <DialogTitle>View/Edit Product</DialogTitle>
                </DialogHeader>
                <DialogDescription className="pt-2">
                  View more or edit the details of the product.
                </DialogDescription>
                <div className="space-y-4 py-4">
                  <div className="flex gap-4">
                      <Label
                        htmlFor="productname"
                        className="w-[25%]"
                      >Product Name </Label>
                      <Input
                        id="productname"
                        placeholder="Product Name"
                        className="mt-1 w-[75%]"
                        defaultValue={product.name}
                      />
                    </div>
                  
                    {/* <div className="flex gap-4">
                      <Label
                        htmlFor="category"
                        className="w-[25%]"
                      >Category </Label>
                      <Select id="category">
                        <SelectTrigger className="w-[75%]">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => {
                            return (
                              <SelectItem key = {category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div> */}
                  
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
                        defaultValue={product.featured}
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
                      />
                    </div>
                </div>
                <DialogFooter>
                <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {/* Delete Dialog */}
            <Dialog>
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
            <Button type="submit" variant="destructive">Delete</Button>
          </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },

]
