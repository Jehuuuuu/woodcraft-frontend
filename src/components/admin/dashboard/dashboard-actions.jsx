"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { IconPrinter, IconTable, IconDownload } from "@tabler/icons-react"
import { printElement } from "@/utils/exportUtils"
import { exportToCSV } from "@/utils/exportUtils"
import { salesData } from "@/components/admin/dashboard/chart-sales-bar"

export function DashboardActions() {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrintDashboard = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 100)
  }

  const handleExportSales = () => {
    exportToCSV(salesData, 'sales-data')
  }

  return (
    <div className="flex gap-2">
      {/* <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePrintDashboard}
        disabled={isPrinting}
      >
        <IconPrinter className="h-4 w-4" />
        Print
      </Button> */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => exportToCSV([ ...salesData], 'dashboard-data')}
      >
        <IconDownload className="h-4 w-4" />
        Export
      </Button>
    </div>
  )
}