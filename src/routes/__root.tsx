import { Outlet, createRootRoute } from '@tanstack/react-router'
import { SidebarProvider } from '@/components/ui/sidebar'

import { AppSidebar } from '@/components/app-sidebar'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
  component: RootComponent
})

function RootComponent() {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((c) => c.startsWith('sidebar:state='));
    // @ts-ignore
    const cookieIsOpen = decodeURIComponent(cookie.split('=')[1]) === "false";

    return (
      <SidebarProvider defaultOpen={cookieIsOpen}>
        <AppSidebar />
        <Outlet />
        <Toaster richColors closeButton />
      </SidebarProvider>
    )
}