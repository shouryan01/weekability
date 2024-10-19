import {
  ChartPie,
  ChartSpline,
  Coins,
  Landmark,
  Rows4,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

import { Link } from "@tanstack/react-router"
import { NavMain } from "@/components/nav-main"
import { ThemeToggle } from "./theme-toggle"

const data = [
  {
    title: "Net Worth",
    url: "/",
    icon: ChartPie,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: Rows4,
  },
  {
    title: "Investments",
    url: "/investments",
    icon: ChartSpline,
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: Landmark,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/">
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                            <Coins className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span>week<span className="font-extrabold">ability</span></span>
                        </div>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter>
        <TooltipProvider>
          <ThemeToggle />
          {/* Sidebar Toggle */}
          <Tooltip>
            <TooltipTrigger>
              <SidebarTrigger />
            </TooltipTrigger>
            <TooltipContent side="right">
              Resize Sidebar
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
