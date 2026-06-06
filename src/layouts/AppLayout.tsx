import * as React from 'react'
import { Outlet } from 'react-router-dom'
import { AppNavbar } from '@/components/layout/AppNavbar'
import { AppSidebar } from '@/components/layout/AppSidebar'

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  // Stub section counts — will be populated from TanStack Query cache in Phase 2+
  const sectionCounts: Record<string, number> = {}

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
          sectionCounts={sectionCounts}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
