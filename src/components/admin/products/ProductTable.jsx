"use client"

import useSWR from "swr";
import { DataTable } from "../dashboard/data-table";
import { useState } from "react";
import { fetchProducts } from "@/actions/api";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
export default function CustomerTable({columns, categories}) {
const pathname = usePathname();
const {data, isLoading, error, mutate} = useSWR('/admin/products', async()=>{
    try{
        const data = await fetchProducts();
        return data || [];
    }catch(error){
        console.error("Error fetching orders:", error);
        return []; 
    }
})
const [sorting, setSorting] = useState([])
const [columnFilters, setColumnFilters] = useState([])
const [open, setOpen] = useState(false)
const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    featured: false,
    default_material: "oak",
    category_id: "",
    image: null,
  });
  const {setCsrfToken} = useAuthStore();
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
  const areAnyFieldsEmpty = () => {
    return !formData.name || !formData.category_id || !formData.description || !formData.price || !formData.stock || !formData.default_material;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const csrfToken = await setCsrfToken();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });
    // mutate((state) => ({
    //   ...state,
    //   products: [
    //     ...state.products,
    //     {
    //       ...formData,
    //       id: Date.now(), 
    //       image: formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image
    //     }
    //   ],
    // }));
    console.log("FormData contents:", Array.from(form.entries())); 
    try {
      const response = await fetch(`${API_URL}/create_product`, {
        method: "POST",
        body: form,
        headers: {
          "X-CSRFToken": csrfToken
        },
        credentials: "include",
      });
      setOpen(false);
      mutate();
      toast.success("Product created successfully");
    } catch (error) {
      mutate();
      console.error("Error creating product:", error);
    }
  };

if (isLoading){
    return(
        <div className="space-y-10 py-10">
            <Skeleton className= "h-10 w-full"/>
            <Skeleton className="h-80 w-full"/>
        </div>
    )
}
if (error) {
    return <div>Error loading products. Please try again later.</div>;
}
    return(
        <DataTable 
            columns={columns}
            data={data}
            pathname={pathname}
            open={open}
            setOpen={setOpen}
            categories={categories}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            areAnyFieldsEmpty={areAnyFieldsEmpty}
            handleSubmit={handleSubmit}
            sorting={sorting}
            setSorting={setSorting}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
        />
    )
}