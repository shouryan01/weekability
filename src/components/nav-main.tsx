import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Link } from "@tanstack/react-router"
import type { LucideIcon } from "lucide-react"
import { useLocation } from '@tanstack/react-router'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const location = useLocation().pathname

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = location == item.url;

          return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton tooltip={item.title} asChild isActive={isActive}>
                  <Link href={item.url} className="h-10 w-10">
                    {item.icon && <item.icon/>}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
