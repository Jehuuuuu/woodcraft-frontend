import { ChartAreaInteractive } from "@/components/admin/dashboard/chart-area-interactive"
import { ChartCategoryPie } from "@/components/admin/dashboard/chart-category-pie"
import { ChartSalesBar } from "@/components/admin/dashboard/chart-sales-bar"
import { SectionCards } from "@/components/admin/dashboard/section-cards"
import { DashboardActions } from "@/components/admin/dashboard/dashboard-actions"

export default function AdminDashboard() {
  return (
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="flex justify-between items-center px-4 lg:px-6">
                  <DashboardActions />
                </div>
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
                  <ChartCategoryPie />
                  <ChartSalesBar />
                </div>
              </div>
            </div>
          </div>
  );
}
