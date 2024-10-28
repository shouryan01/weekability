import { CalendarIcon, CirclePlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { invoke } from "@tauri-apps/api/core"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const FormSchema = z.object({
    description: z.string().min(2, {
        message: "Transaction description must be at least 2 characters.",
    }),
    account_id: z.coerce.number(),
    category_id: z.coerce.number(),
    transaction_date: z.coerce.date({ required_error: "Transaction date is required.", }),
    amount: z.coerce.number({
        required_error: "Transaction balance is required",
        invalid_type_error: "Transaction balance must be a number",
    }).min(0, {
        message: "Transaction balance must be minimum $0.00."
    })
})

export function TransactionForm({ getCategories, setOpen }: { getCategories: () => Promise<void>, setOpen: (open: boolean) => void }) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            description: "",
            account_id: 1,
            category_id: 1,
            transaction_date: new Date(),
            amount: 0
        },
    })

    async function onSubmit(transaction: z.infer<typeof FormSchema>) {
        try {
            await invoke("create_transaction", { description: transaction.description, accountId: transaction.account_id, categoryId: transaction.category_id, transactionDate: transaction.transaction_date.toISOString().split('T')[0], amount: transaction.amount });
            toast.success('Transaction has been created!')
            getCategories();
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
                            <FormControl>
                                <Input placeholder="Account ID" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Category ID" type="number" {...field} />
                            </FormControl>
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
                <TransactionForm getCategories={getTransactions} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    )
}