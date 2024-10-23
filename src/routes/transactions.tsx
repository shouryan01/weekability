import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/transactions")({
	component: Transactions,
});

function Transactions() {
	return (
		<div className="flex justify-center min-h-screen w-screen">
			Transactions
		</div>
	);
}
