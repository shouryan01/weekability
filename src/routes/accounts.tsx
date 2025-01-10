import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import type { Account } from "@/lib/types";
import { AccountFormDialog } from "@/components/forms/account-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
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

	const deleteAccount = async (id: number): Promise<void> => {
		try {
			await invoke("delete_account", { id });
			getAccounts();
		} catch (error) {
			console.error("Error deleting account:", error);
		}
		toast.error('Account has been deleted.')
	};

	const updateAccount = async (id: number, balance: number): Promise<void> => {
		try {
			await invoke("update_account", { id, balance });
			toast.success('Account has been updated!')
			getAccounts();
		} catch (error) {
			console.error("Error updating account:", error);
		}
	}

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
									<TableCell>{account.name}</TableCell>
									<TableCell>{account.account_type}</TableCell>
									<TableCell>{account.opened}</TableCell>
									<TableCell>
										<Input
											type="number"
											step="0.01"
											defaultValue={(account.balance / 100).toFixed(2)}
											onChange={(e) => {
												const value = e.target.value;
												if (value.includes('.') && value.split('.')[1].length > 2) {
													e.target.value = Number(value).toFixed(2);
												}
											}}
											onBlur={(e) => {
												const dollarValue = Number.parseFloat(e.target.value);
												const centsValue = Math.round(dollarValue * 100);
												updateAccount(account.id, centsValue);
											}}
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
