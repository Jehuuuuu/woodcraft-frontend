"use client"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
export const CustomerColumns= [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0 !p-0" 
        >
          ID
          <ArrowUpDown />
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0"
        >
          Customer Name
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
            Email
            <ArrowUpDown/>
          </Button>
        )
      },
    accessorKey: "email"
},

  {
    accessorKey: "date_joined",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!px-0"
        >
          Date Joined
          <ArrowUpDown />
        </Button>
      )
    },
  },
]
