"use client"

import * as React from "react"
import { Cell, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const categoryData = [
  { name: "Decors", value: 35, color: "#0ea5e9" },
  { name: "Wall Decors", value: 25, color: "#22c55e" },
]

const chartConfig = {
decors: {
    label: "Decors",
    color: "#0ea5e9",
  },
  wallDecors: {
    label: "Wall Decor",
    color: "#22c55e",
  },
}

export function ChartCategoryPie() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Product Categories</CardTitle>
        <CardDescription>
          Distribution of products by category
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={(entry) => `${entry.name}: ${entry.value}%`}
              labelLine={false}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${value}%`}
                  labelFormatter={(value) => value}
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}