import { NavMain } from "@/components/nav-main";
import { useTheme } from "@/components/theme-provider.tsx";
import { Button } from "@/components/ui/button.tsx";
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
	useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import {
	ChartPie,
	Coins,
	Landmark,
	List,
	Moon,
	Rows4,
	Sun,
	UnfoldHorizontal,
} from "lucide-react";
import type * as React from "react";
import { ThemeToggle } from "./theme-toggle";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

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
	{
		title: "Categories",
		url: "/categories",
		icon: List,
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { theme, setTheme } = useTheme();
	const { toggleSidebar, open } = useSidebar();
	const isOpen = open;

	return (
		<Sidebar
			variant="sidebar"
			collapsible="icon"
			{...props}
			className="pt-8 max-h-screen bg-sidebar"
		>
			<SidebarHeader className="mx-2.5">
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
												<Coins className="size-5" />
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

			<SidebarContent className="mx-2.5">
				<NavMain items={data} />
			</SidebarContent>

			<SidebarFooter className="mx-2.5">
				{isOpen && (
					<div className="flex flex-row gap-1">
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Button
										variant="outline"
										onClick={() =>
											setTheme(theme === "light" ? "dark" : "light")
										}
									>
										<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 hover:rotate-45 transition-all duration-150 dark:-rotate-90 dark:scale-0" />
										<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 hover:rotate-45 transition-all duration-150 dark:rotate-0 dark:scale-100" />
									</Button>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>

						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Button variant="outline" onClick={toggleSidebar}>
										<UnfoldHorizontal className="h-[1.2rem] w-[1.2rem] transition-all duration-150" />
									</Button>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</div>
				)}

				{!isOpen && (
					<TooltipProvider>
						<div className="flex flex-col gap-1">
							<ThemeToggle />
							<Tooltip>
								<TooltipTrigger asChild>
									<SidebarTrigger />
								</TooltipTrigger>
								<TooltipContent side="right">Resize Sidebar</TooltipContent>
							</Tooltip>
						</div>
					</TooltipProvider>
				)}
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
