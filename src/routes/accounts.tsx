import type { Account } from "@/lib/types";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import { AccountForm } from "@/components/forms/account-form";
import { Button } from "@/components/ui/button";
import { CirclePlus, Pencil, Trash } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";

export const Route = createFileRoute("/accounts")({
	component: Accounts,
});

function Accounts() {
	const [accounts, setAccounts] = useState<Account[]>([]);

	useEffect(() => {
		getAccounts();
	}, []);

	// const createAccount = async () => {
	// 	const account: Account = {
	// 		name: "New Account",
	// 		account_type: "checking",
	// 		balance: 0.1,
	// 		opened: new Date(),
	// 	};
	// 	try {
	// 		await invoke("create_account", { name: "test", accountType: account.account_type, balance: account.balance, opened: new Date().toISOString().split('T')[0] });
	// 	} catch (error) {
	// 		console.error("Error adding account:", error);
	// 	}
	// };

	const getAccounts = async () => {
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
	}

	function updateAccount(id: number): void {
		console.log(id);
	}

	return (
		<div className="flex justify-center min-h-screen w-screen">
			<div>
				<Dialog>
					<DialogTrigger>
						<CirclePlus className="h-8 w-8 fixed top-0 right-0 rounded-full m-1 transition duration-100 hover:bg-zinc-300" />{" "}
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add a new Account</DialogTitle>
							<DialogDescription>test</DialogDescription>
						</DialogHeader>

						<AccountForm />
					</DialogContent>
				</Dialog>

				<div className="flex flex-col items-center min-h-screen text-center">
					<h1 className="text-3xl mb-8">Accounts</h1>

					{/* <Button onClick={() => createAccount()}>Add</Button> */}

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Opened</TableHead>
								<TableHead>Balance</TableHead>
								<TableHead>Actions</TableHead>
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
									<TableCell>${account.balance}</TableCell>
									<TableCell className="flex gap-2">
										<Button size="icon" variant="outline" onClick={() => updateAccount(account.id)}><Pencil className="h-4 w-4" /></Button>
										<Button size="icon" variant="destructive" onClick={() => deleteAccount(account.id)}><Trash className="h-4 w-4" /></Button>
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
