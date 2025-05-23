import { AccountFormDialog } from "@/components/forms/account-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar.tsx";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Account } from "@/lib/types";
import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { format } from "date-fns";
import { CalendarIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/accounts")({
	component: Accounts,
});

function Accounts() {
	const [accounts, setAccounts] = useState<Account[]>([]);

	useEffect(() => {
		getAccounts();
	}, []);

	const getAccounts = async (): Promise<void> => {
		try {
			const accounts = (await invoke("get_accounts")) as Account[];
			setAccounts(accounts);
		} catch (error) {
			console.error("Error fetching accounts:", error);
		}
	};

	const updateAccount = async (
		id: number,
		name: string,
		type: string,
		balance: number,
		opened: string,
	): Promise<void> => {
		try {
			await invoke("update_account", {
				id: id,
				name: name,
				accountType: type,
				balance: balance,
				opened: opened,
			});
			toast.success("Account has been updated!");
			getAccounts();
		} catch (error) {
			console.error("Error updating account:", error);
		}
	};

	const deleteAccount = async (id: number): Promise<void> => {
		try {
			await invoke("delete_account", { id });
			getAccounts();
		} catch (error) {
			console.error("Error deleting account:", error);
		}
		toast.error("Account is used in a transaction, unable to delete.");
	};

	return (
		<div className="flex justify-center min-h-screen w-screen">
			<div>
				<div className="flex flex-col items-center min-h-screen text-center mt-5">
					<h1 className="text-3xl mb-8">Accounts</h1>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Opened</TableHead>
								<TableHead>Balance</TableHead>
								<TableHead>Delete</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className="text-left">
							{accounts.map((account: Account) => (
								<TableRow key={account.id} className="mb-2">
									<TableCell>
										<Input
											type="text"
											defaultValue={account.name}
											onBlur={(e) => {
												updateAccount(
													account.id,
													e.target.value,
													account.account_type,
													account.balance,
													account.opened,
												);
											}}
											className="w-36"
										/>
									</TableCell>
									<TableCell>
										<Input
											type="text"
											defaultValue={account.account_type}
											onBlur={(e) => {
												updateAccount(
													account.id,
													account.name,
													e.target.value,
													account.balance,
													account.opened,
												);
											}}
											className="w-36"
										/>
									</TableCell>
									<TableCell>
										<Popover>
											<PopoverTrigger asChild>
												<Button variant={"outline"} className="w-36">
													{format(account.opened, "PP")}
													<CalendarIcon className="ml-3 mb-0.5 h-4 w-4 opacity-50" />
												</Button>
											</PopoverTrigger>

											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={new Date(account.opened)}
													onSelect={(e) => {
														// @ts-ignore
														updateAccount(
															account.id,
															account.name,
															account.account_type,
															account.balance,
															e.toISOString(),
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
											defaultValue={(account.balance / 100).toFixed(2)}
											onBlur={(e) => {
												const dollarValue = Number.parseFloat(e.target.value);
												const centsValue = Math.round(dollarValue * 100);
												updateAccount(
													account.id,
													account.name,
													account.account_type,
													centsValue,
													account.opened,
												);
											}}
											className="w-36"
										/>
									</TableCell>
									<TableCell className="flex gap-2">
										<Button
											size="icon"
											variant="destructive"
											onClick={() => deleteAccount(account.id)}
										>
											<Trash className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				<AccountFormDialog getAccounts={getAccounts} />
			</div>
		</div>
	);
}
