"use client"
import { DataTable } from "../dashboard/data-table";
import { useState } from "react";
import { usePathname } from "next/navigation";
export default function ProductTable({categories, columns, data}) {
const [sorting, setSorting] = useState([])
const [columnFilters, setColumnFilters] = useState([])
const pathname = usePathname()
    return(
        <DataTable 
            columns={columns}
            data={data}
            categories={categories}
            pathname={pathname}
            sorting={sorting}
            setSorting={setSorting}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
        />
    )
}