"use client"
import { DataTable } from "../dashboard/data-table";
import { useState } from "react";
export default function OrdersTable({columns, data}) {
const [sorting, setSorting] = useState([])
const [columnFilters, setColumnFilters] = useState([])
const [columnVisibility, setColumnVisibility] = useState({
    currency: false,
    items: false 
  });
    return(
        <DataTable 
            columns={columns}
            data={data}
            sorting={sorting}
            columnVisibility={columnVisibility}
            setSorting={setSorting}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            setColumnVisibility={setColumnVisibility}
        />
    )
}