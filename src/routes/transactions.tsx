import ImportCSV from "@/components/csv-importer.tsx";
import { TransactionFormDialog } from "@/components/forms/transaction-form.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select.tsx";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.tsx";
import type { Account, Category, Transaction } from "@/lib/types.ts";
import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { format } from "date-fns";
import { CalendarIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/transactions")({
	component: Transactions,
});

function Transactions() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		getTransactions();
		getAccounts();
		getCategories();
	}, []);

	const getTransactions = async (): Promise<void> => {
		try {
			const transactions = (await invoke("get_transactions")) as Transaction[];
			setTransactions(transactions);
		} catch (error) {
			console.error("Error fetching transactions:", error);
		}
	};

	const getAccounts = async (): Promise<void> => {
		try {
			const accounts = (await invoke("get_accounts")) as Account[];
			setAccounts(accounts);
		} catch (error) {
			console.error("Error fetching accounts:", error);
		}
	};

	const getCategories = async (): Promise<void> => {
		try {
			const categories = (await invoke("get_categories")) as Category[];
			setCategories(categories);
		} catch (error) {
			console.error("Error fetching accounts:", error);
		}
	};

	const updateTransactions = async (
		id: number,
		account_id: number,
		category_id: number,
		description: string,
		transaction_date: string,
		amount: number,
	): Promise<void> => {
		try {
			await invoke("update_transaction", {
				id: id,
				accountId: account_id,
				categoryId: category_id,
				description: description,
				transactionDate: transaction_date,
				amount: amount,
			});
			toast.success("Transaction has been updated!");
			getTransactions();
		} catch (error) {
			console.error("Error updating transactions:", error);
		}
	};

	const deleteTransaction = async (id: number): Promise<void> => {
		try {
			await invoke("delete_transaction", { id });
			getTransactions();
		} catch (error) {
			console.error("Error deleting transaction:", error);
		}
		toast.error("Transaction has been deleted.");
	};

	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="flex justify-center min-h-screen w-screen">
			<div>
				<div className="flex flex-col items-center min-h-screen text-center mt-5">
					<h1 className="text-3xl mb-8">Transactions</h1>
					<Button
						onClick={() => {
							setIsOpen(!isOpen);
						}}
					>
						Open CSV Importer
					</Button>

					<ImportCSV isOpen={isOpen} setIsOpen={setIsOpen} />

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
							{transactions.map((transaction: Transaction) => {
								return (
									<TableRow key={transaction.id} className="mb-2">
										<TableCell>
											<Input
												type="text"
												defaultValue={transaction.description}
												onBlur={(e) => {
													updateTransactions(
														transaction.id,
														transaction.account_id,
														transaction.category_id,
														e.target.value,
														transaction.transaction_date,
														transaction.amount,
													);
												}}
												className="w-36"
											/>
										</TableCell>
										<TableCell>
											<Select
												onValueChange={(e) => {
													updateTransactions(
														transaction.id,
														transaction.account_id,
														Number.parseInt(e),
														transaction.description,
														transaction.transaction_date,
														transaction.amount,
													);
												}}
												value={transaction.category_id.toString()}
											>
												<SelectTrigger className="w-36">
													<SelectValue placeholder="Select a category." />
												</SelectTrigger>
												<SelectContent>
													{categories.map((category) => (
														<SelectItem
															key={category.id}
															value={category.id.toString()}
														>
															{category.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</TableCell>
										<TableCell>
											<Select
												onValueChange={(e) => {
													updateTransactions(
														transaction.id,
														Number.parseInt(e),
														transaction.category_id,
														transaction.description,
														transaction.transaction_date,
														transaction.amount,
													);
												}}
												value={transaction.account_id.toString()}
											>
												<SelectTrigger className="w-36">
													<SelectValue placeholder="Select an account." />
												</SelectTrigger>
												<SelectContent>
													{accounts.map((account) => (
														<SelectItem
															key={account.id}
															value={account.id.toString()}
														>
															{account.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</TableCell>
										<TableCell>
											<Popover>
												<PopoverTrigger asChild>
													<Button variant={"outline"} className="w-36">
														{format(transaction.transaction_date, "PP")}
														<CalendarIcon className="ml-3 mb-0.5 h-4 w-4 opacity-50" />
													</Button>
												</PopoverTrigger>

												<PopoverContent className="w-auto p-0" align="start">
													<Calendar
														mode="single"
														selected={new Date(transaction.transaction_date)}
														onSelect={(e) => {
															// @ts-ignore
															updateTransactions(
																transaction.id,
																transaction.account_id,
																transaction.category_id,
																transaction.description,
																e.toISOString(),
																transaction.amount,
															);
														}}
														disabled={(date) => date > new Date()}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
										</TableCell>
										<TableCell>
											<Input
												type="number"
												step="0.01"
												defaultValue={(transaction.amount / 100).toFixed(2)}
												onBlur={(e) => {
													const dollarValue = Number.parseFloat(e.target.value);
													const centsValue = Math.round(dollarValue * 100);
													updateTransactions(
														transaction.id,
														transaction.account_id,
														transaction.category_id,
														transaction.description,
														transaction.transaction_date,
														centsValue,
													);
												}}
												className="w-36"
											/>
										</TableCell>
										<TableCell className="flex gap-2">
											<Button
												size="icon"
												variant="destructive"
												onClick={() => deleteTransaction(transaction.id)}
											>
												<Trash className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
					<TransactionFormDialog getTransactions={getTransactions} />
				</div>
			</div>
		</div>
	);
}
