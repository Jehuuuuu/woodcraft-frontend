"use client"

import useSWR from "swr";
import { DataTable } from "../dashboard/data-table";
import { useState } from "react";
import { fetchCustomerDesigns } from "@/actions/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerDesignsTable({columns}) {
const [sorting, setSorting] = useState([])
const [columnFilters, setColumnFilters] = useState([])
const {data, isLoading, error} = useSWR('/admin/customer-designs', async()=>{
    try{
        const data = await fetchCustomerDesigns();
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
    return <div>Error loading customer designs. Please try again later.</div>;
}
    return(
        <DataTable 
            columns={columns}
            data={data}
            sorting={sorting}
            setSorting={setSorting}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
        />
    )
}