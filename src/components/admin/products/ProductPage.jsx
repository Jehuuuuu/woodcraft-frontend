"use client"
import { DataTable } from "../dashboard/data-table";
import { useState } from "react";
export default function ProductTable({columns, data}) {
const [sorting, setSorting] = useState([])
const [columnFilters, setColumnFilters] = useState([])
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