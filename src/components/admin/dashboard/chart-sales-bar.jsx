"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Add these imports at the top
import { Button } from "@/components/ui/button"
import { IconPrinter, IconTable } from "@tabler/icons-react"
import { printElement, exportToCSV } from "@/utils/exportUtils"

// Export the salesData so it can be used by the DashboardActions component
export const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 2000 },
  { month: "Apr", sales: 2780 },
  { month: "May", sales: 1890 },
  { month: "Jun", sales: 2390 },
  { month: "Jul", sales: 3490 },
  { month: "Aug", sales: 2500 },
  { month: "Sep", sales: 3200 },
  { month: "Oct", sales: 2800 },
  { month: "Nov", sales: 3300 },
  { month: "Dec", sales: 4100 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--primary)",
  },
}

export function ChartSalesBar() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Monthly Sales</CardTitle>
        <CardDescription>
          Sales performance by month
        </CardDescription>
        <CardAction>
          <div className="flex gap-2">
            {/* <Button 
              variant="outline" 
              size="sm" 
              onClick={() => printElement('sales-chart', 'Monthly Sales Chart')}
            >
              <IconPrinter className="h-4 w-4" />
            </Button> */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => exportToCSV(salesData, 'sales-data')}
            >
              <IconTable className="h-4 w-4" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer id="sales-chart" config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart data={salesData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tickLine={false} 
              axisLine={false} 
              tickMargin={8} 
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tickMargin={8} 
              tickFormatter={(value) => `₱${value}`}
            />
            <Bar 
              dataKey="sales" 
              fill="var(--color-sales)" 
              radius={[4, 4, 0, 0]} 
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              content={
                <ChartTooltipContent
                  formatter={(value) => `₱${value.toLocaleString()}`}
                />
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}