import "../App.css";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return <div className="flex justify-center w-screen">Net Worth</div>;
}

export default App;
