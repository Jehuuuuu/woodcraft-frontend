"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export function DataTable({
  columns,
  data,
  categories,
  pathname,
  open,
  setOpen,
  formData,
  setFormData,
  handleInputChange,
  handleFileChange,
  areAnyFieldsEmpty,
  handleSubmit,
  sorting,
  setSorting,
  columnVisibility,
  columnFilters,
  setColumnFilters,
  setColumnVisibility,
}) {
  const table = useReactTable({
    data,
    columns,
    categories,
    pathname,
    setOpen,
    setFormData,
    handleInputChange,
    handleFileChange,
    areAnyFieldsEmpty,
    handleSubmit,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      formData,
      sorting,
      open,
      columnFilters,
      columnVisibility,
    },
  });
  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {pathname === "/admin/products" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 hover:text-white"
              >
                Add Product
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Product</DialogTitle>
              </DialogHeader>

              <div className="flex gap-4">
                <Label htmlFor="name" className="w-[25%]">
                  Product Name{" "}
                </Label>
                <Input
                  id="name"
                  placeholder="Product Name"
                  className="mt-1 w-[75%]"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex gap-4">
                <Label htmlFor="category_id" className="w-[25%]">
                  Category{" "}
                </Label>
                <Select
                  id="category_id"
                  onValueChange={(value) =>
                    handleInputChange({ target: { id: "category_id", value } })
                  }
                >
                  <SelectTrigger className="w-[75%]">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => {
                      return (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Label htmlFor="description" className="w-[25%]">
                  Description{" "}
                </Label>
                <Input
                  id="description"
                  placeholder="Description"
                  className="mt-1 w-[75%]"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex gap-4">
                <Label htmlFor="price" className="w-[25%]">
                  Price{" "}
                </Label>
                <Input
                  id="price"
                  placeholder="Price"
                  type="number"
                  step="0.01"
                  className="mt-1 w-[75%]"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex gap-4">
                <Label htmlFor="stock" className="w-[25%]">
                  Stock{" "}
                </Label>
                <Input
                  id="stock"
                  placeholder="Stock"
                  type="number"
                  className="mt-1 w-[75%]"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex gap-4">
                <Label htmlFor="featured" className="w-[25%]">
                  Featured{" "}
                </Label>
                <Input
                  id="featured"
                  type="checkbox"
                  className="mt-1 h-4 w-4"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex gap-4">
                <Label htmlFor="image" className="w-[25%]">
                  Image{" "}
                </Label>
                <Input
                  id="image"
                  type="file"
                  className="mt-1 w-[75%]"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex gap-4">
                <Label htmlFor="default_material" className="w-[25%]">
                  Default Material{" "}
                </Label>
                <Input
                  id="default_material"
                  placeholder="Default Material"
                  defaultValue="oak"
                  className="mt-1 w-[75%]"
                  onChange={handleInputChange}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={areAnyFieldsEmpty()}
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {pathname === "/admin/orders" && (
        <Tabs
          defaultValue=""
          onValueChange={(value) =>
            table.getColumn("status").setFilterValue(value)
          }
        >
          <TabsList>
            <TabsTrigger value="">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      <div className="rounded-md border mt-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
