"use client"

import useSWR from "swr";
import { DataTable } from "../dashboard/data-table";
import { useState } from "react";
import { fetchCustomers } from "@/actions/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerTable({columns}) {
const [sorting, setSorting] = useState([])
const [columnFilters, setColumnFilters] = useState([])
const {data, isLoading, error} = useSWR('/admin/customers', async()=>{
    try{
        const data = await fetchCustomers();
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
    return <div>Error loading customers. Please try again later.</div>;
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