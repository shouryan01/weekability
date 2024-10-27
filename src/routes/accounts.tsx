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
			const raw_accounts = (await invoke("get_accounts")) as Account[];
			const accounts = raw_accounts.map((account) => ({
				...account,
				opened: new Date(account.opened),
			}));

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
				<AccountFormDialog getAccounts={getAccounts} />

				<div className="flex flex-col items-center min-h-screen text-center">
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
									<TableCell>
										{account.opened.toLocaleDateString("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</TableCell>
									<TableCell>
										<Input
											type="number"
											defaultValue={account.balance}
											onBlur={(e) => updateAccount(account.id, Number.parseFloat(e.target.value))}
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
			</div>
		</div>
	);
}
