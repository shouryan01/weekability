import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from 'react';

import { AccountForm } from "@/forms/account-form";
import { CirclePlus } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router'
import { db } from '@/lib/db';

export const Route = createFileRoute('/accounts')({
  component: Accounts,
})

function Accounts() {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const result = await db.select("SELECT * FROM accounts");
                setAccounts(result);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        };

        fetchAccounts();
    }, []);

    return (
        <div className="flex justify-center min-h-screen w-screen">
            <div>
                <Dialog>
                    <DialogTrigger><CirclePlus className='h-8 w-8 fixed top-0 right-0 rounded-full m-1 transition duration-100 hover:bg-zinc-300' /> </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a new Account</DialogTitle>
                            <DialogDescription>
                            </DialogDescription>
                        </DialogHeader>

                        <AccountForm />
                    </DialogContent>
                </Dialog>

                <div className="flex flex-col items-center min-h-screen text-center">
                    <h1 className="text-3xl mb-8">Accounts</h1>

                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Opened</TableHead>
                            <TableHead>Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className='text-left'>
                            {accounts.map((account: { id: number; name: string; account_type: string; opened: string; balance: number }) => (
                                <TableRow key={account.id} className="mb-2">
                                    <TableCell>{account.name}</TableCell>
                                    <TableCell>{account.account_type}</TableCell>
                                    <TableCell>{account.opened}</TableCell>
                                    <TableCell>${account.balance / 100}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}