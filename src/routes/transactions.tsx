import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {useEffect, useState} from "react";

import {Button} from "@/components/ui/button.tsx";
import type {Transaction} from "@/lib/types.ts";
import {TransactionFormDialog} from "@/components/forms/transaction-form.tsx";
import {Trash} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import {invoke} from "@tauri-apps/api/core";
import {toast} from "sonner";

export const Route = createFileRoute("/transactions")({
	component: Transactions,
});

function Transactions() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	useEffect(() => {
		getTransactions();
	}, []);

	const getTransactions = async (): Promise<void> => {
		try {
			const transactions = (await invoke("get_transactions")) as Transaction[];

			setTransactions(transactions);
		} catch (error) {
			console.error("Error fetching transactions:", error);
		}
	};

	const deleteTransaction = async (id: number): Promise<void> => {
		try {
			await invoke("delete_transaction", { id });
			getTransactions();
		} catch (error) {
			console.error("Error deleting transaction:", error);
		}
		toast.error('Transaction has been deleted.')
	};

	return (
		<div className="flex justify-center min-h-screen w-screen">
			<div>
				<div className="flex flex-col items-center min-h-screen text-center mt-5">
					<h1 className="text-3xl mb-8">Transactions</h1>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Description</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Account</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Delete</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className="text-left">
							{transactions.map((transaction: Transaction) => (
								<TableRow key={transaction.id} className="mb-2">
									<TableCell>{transaction.description}</TableCell>
									<TableCell>{transaction.category_id}</TableCell>
									<TableCell>{transaction.account_id}</TableCell>
									<TableCell>{transaction.transaction_date}</TableCell>
									<TableCell>{transaction.amount / 100}</TableCell>
									<TableCell className="flex gap-2">
										<Button
											size="icon"
											variant="destructive"
											onClick={() => deleteTransaction(transaction.id)}
										>
											<Trash className="h-4 w-4"/>
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<TransactionFormDialog getTransactions={getTransactions}/>
				</div>
			</div>
		</div>
	);
}
