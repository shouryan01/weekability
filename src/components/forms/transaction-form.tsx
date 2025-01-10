import type { Account, Category, TransactionFormLabel } from "@/lib/types"
import { CalendarIcon, CirclePlus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { invoke } from "@tauri-apps/api/core"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const FormSchema = z.object({
    description: z.string().min(2, {
        message: "Transaction description must be at least 2 characters.",
    }),
    account_id: z.string(),
    category_id: z.string(),
    transaction_date: z.coerce.date({ required_error: "Transaction date is required.", }),
    amount: z.coerce.number({
        required_error: "Transaction balance is required",
        invalid_type_error: "Transaction balance must be a number",
    }).min(0, {
        message: "Transaction balance must be minimum $0.00."
    })
})

export function TransactionForm({ getCategories, setOpen }: { getCategories: () => Promise<void>, setOpen: (open: boolean) => void }) {
    const [accountNames, setAccountNames] = useState<TransactionFormLabel[]>([]);
	const [categoryNames, setCategoryNames] = useState<TransactionFormLabel[]>([]);

    useEffect(() => {
		getAccountNames();
		getCategoryNames();
	}, []);

    const getAccountNames = async (): Promise<void> => {
		try {
			const raw_account_names = (await invoke("get_accounts")) as Account[];
			const account_names = raw_account_names.map(({ id, name, account_type }) => ({ id, name: `${name} - ${account_type}` }));
			setAccountNames(account_names);
		} catch (error) {
			console.error("Error fetching accounts:", error);
		}
	}

	const getCategoryNames = async (): Promise<void> => {
		try {
			const raw_categories = (await invoke("get_categories")) as Category[];
			setCategoryNames(raw_categories);
		} catch (error) {
			console.error("Error fetching accounts:", error);
		}
	}
    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            description: "",
            transaction_date: new Date(),
            amount: 0
        },
    })

    async function onSubmit(transaction: z.infer<typeof FormSchema>) {
        try {
            await invoke("create_transaction", { description: transaction.description, accountId: Number.parseInt(transaction.account_id), categoryId: Number.parseInt(transaction.category_id), transactionDate: transaction.transaction_date.toISOString().split('T')[0], amount: transaction.amount });
            toast.success('Transaction has been created!')
            await getCategories();
        } catch (error) {
            console.error("Error adding transaction:", error);
        }
        setOpen(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Transaction Description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="account_id"
                    render={({ field }) => (
                        <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an account." />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {accountNames.map((account) => 
                                        <SelectItem key={account.id} value={account.id.toString()}>{account.name}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                        <FormItem>
                            {/* <FormControl>
                                <Input placeholder="Category ID" type="number" {...field} />
                            </FormControl> */}
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category." />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categoryNames.map((category) => 
                                        <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="transaction_date"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Account Opened Date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date > new Date() || date < new Date("2019-01-01")
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                    </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Amount $" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit">Create</Button>
                </div>
            </form>
        </Form>
    )
}

export function TransactionFormDialog({ getTransactions }: { getTransactions: () => Promise<void> }) {
    const [open, setOpen] = useState(false)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button variant="outline" size="icon" className="h-10 w-10 fixed bottom-0 right-0 transition duration-100 m-4">
                    <CirclePlus className="h-8 w-8" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new Transaction</DialogTitle>
                </DialogHeader>
                <DialogDescription className="">All fields are required.</DialogDescription>
                <TransactionForm getCategories={getTransactions} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    )
}