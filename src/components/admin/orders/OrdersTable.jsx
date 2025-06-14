"use client";
import useSWR from "swr";
import { DataTable } from "../dashboard/data-table";
import { useState } from "react";
import { fetchAllOrders } from "@/actions/api";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";

export default function OrdersTable({ columns }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({
    currency: false,
    items: false,
  });
  const pathname = usePathname();
  const { data, error, isLoading } = useSWR("/admin/orders", async () => {
    try {
      const data = await fetchAllOrders();
      return data || [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-10 py-10">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading orders. Please try again later.</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={data || []}
      pathname={pathname}
      sorting={sorting}
      columnVisibility={columnVisibility}
      setSorting={setSorting}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
      setColumnVisibility={setColumnVisibility}
    />
  );
}
