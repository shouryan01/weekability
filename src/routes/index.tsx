import { ChartComponent } from "@/components/chart-test";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="flex justify-center w-screen">
			<ChartComponent />
		</div>
	);
}

export default App;
