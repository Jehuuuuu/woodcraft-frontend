"use client"

import useSWR from "swr";
import { DataTable } from "../dashboard/data-table";
import { useState } from "react";
import { fetchProducts } from "@/actions/api";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";

export default function CustomerTable({columns, categories}) {
const [sorting, setSorting] = useState([])
const [columnFilters, setColumnFilters] = useState([])
const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    featured: false,
    default_material: "",
    category_id: "",
    image: null,
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      const response = await fetch("/api/create_product", {
        method: "POST",
        body: form,
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
const pathname = usePathname();
const {data, isLoading, error} = useSWR('/admin/products', async()=>{
    try{
        const data = await fetchProducts();
        return data || [];
    }catch(error){
        console.error("Error fetching orders:", error);
        return []; 
    }
})
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
            categories={categories}
            formData={formData}
            setFormData={setFormData}
            sorting={sorting}
            setSorting={setSorting}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
        />
    )
}