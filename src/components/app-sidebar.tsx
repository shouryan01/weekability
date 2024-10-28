import { ChartPie, ChartSpline, Coins, Landmark, Rows4, Settings } from "lucide-react";
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
} from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { NavMain } from "@/components/nav-main";
import { ThemeToggle } from "./theme-toggle";

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
	// {
	// 	title: "Investments",
	// 	url: "/investments",
	// 	icon: ChartSpline,
	// },
	{
		title: "Accounts",
		url: "/accounts",
		icon: Landmark,
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Link href="/">
										<SidebarMenuButton
											size="lg"
											className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
										>
											<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
												<Coins className="size-4" />
											</div>
											<div className="grid flex-1 text-left text-sm leading-tight">
												<span>
													week<span className="font-extrabold">ability</span>
												</span>
											</div>
										</SidebarMenuButton>
									</Link>
								</TooltipTrigger>
								<TooltipContent side="right">weekability</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data} />
			</SidebarContent>
			<SidebarFooter>
				<TooltipProvider>
					<div>
						<ThemeToggle />
						<Tooltip>
							<TooltipTrigger asChild>
								<Link href="/settings">
									<Button
										variant="outline"
										size="icon"
										className="h-8 w-8"
									>
										<Settings className="h-[1.2rem] w-[1.2rem] hover:rotate-45 transition-all duration-200" />
									</Button>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Settings</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<SidebarTrigger />
							</TooltipTrigger>
							<TooltipContent side="right">Resize Sidebar</TooltipContent>
						</Tooltip>
					</div>
				</TooltipProvider>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
