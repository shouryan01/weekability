import { Outlet, createRootRoute } from '@tanstack/react-router'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

import { AppSidebar } from '@/components/app-sidebar'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
  component: RootComponent
})

function RootComponent() {
    return (
      <SidebarProvider>
        <AppSidebar />
        <Outlet />
        <Toaster richColors closeButton />
      </SidebarProvider>
    )
}