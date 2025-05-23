import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	const cookies = document.cookie.split("; ");
	const cookie = cookies.find((c) => c.startsWith("sidebar:state="));
	const cookieIsOpen = cookie
		? decodeURIComponent(cookie.split("=")[1]) === "false"
		: false;

	return (
		<SidebarProvider defaultOpen={cookieIsOpen}>
			<AppSidebar />
			<Outlet />
			<Toaster richColors closeButton />
		</SidebarProvider>
	);
}
