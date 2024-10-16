import { ArrowLeft, CirclePlus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Link, createFileRoute } from '@tanstack/react-router'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db';

export const Route = createFileRoute('/accounts')({
  component: Accounts,
})

function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [newAccount, setNewAccount] = useState({ name: '', type: '', balance: 0, });

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const result = await db.select("SELECT id, name, balance, type, opened FROM accounts");
                setAccounts(result);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        };

        fetchAccounts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAccount({ ...newAccount, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await db.execute("INSERT INTO accounts (name, type, balance) VALUES ($1, $2, $3)", [newAccount.name, newAccount.type, 5.6]);
            setAccounts([...accounts, newAccount]);
            setNewAccount({ name: '', type: '', balance: 0 });
        } catch (error) {
            console.error("Error adding account:", error);
        }
    };

    return (
        <div>
            <Link href='/'>
                <ArrowLeft className='h-8 w-8 fixed top-0 left-0 rounded-full m-1 transition duration-100 hover:bg-zinc-300' /> 
            </Link>

            <Dialog>
                <DialogTrigger><CirclePlus className='h-8 w-8 fixed top-0 right-0 rounded-full m-1 transition duration-100 hover:bg-zinc-300' /> </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a new Account</DialogTitle>
                        <DialogDescription>
                        <form onSubmit={handleSubmit} className="mt-4 flex">
                            <Input
                                type="text"
                                name="name"
                                value={newAccount.name}
                                onChange={handleInputChange}
                                placeholder="Account Name"
                                className="mr-2"
                                required
                            />
                            <Input
                                type="text"
                                name="type"
                                value={newAccount.type}
                                onChange={handleInputChange}
                                placeholder="Account Type"
                                className="mr-2"
                                required
                            />
                            <Input
                                type="number"
                                name="balance"
                                value={newAccount.balance}
                                onChange={handleInputChange}
                                placeholder="Initial Balance"
                                className="mr-2"
                                required
                            />
                            <Button type="submit">Add Account</Button>
                        </form>
                        </DialogDescription>
                    </DialogHeader>
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
                        {accounts.map((account, index) => (
                            <TableRow key={account.id} className="mb-2">
                                <TableCell>{account.name}</TableCell>
                                <TableCell>{account.type}</TableCell>
                                <TableCell>{account.opened}</TableCell>
                                <TableCell>${account.balance.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}