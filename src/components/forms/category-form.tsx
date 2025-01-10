import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { CirclePlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { invoke } from "@tauri-apps/api/core"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Account Name must be at least 2 characters.",
    }),
})

export function CategoryForm({ getCategories, setOpen }: { getCategories: () => Promise<void>, setOpen: (open: boolean) => void }) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: ""
        },
    })

    async function onSubmit(category: z.infer<typeof FormSchema>) {
        try {
            await invoke("create_category", { name: category.name });
        } catch (error) {
            console.error("Error adding category:", error);
        }
        toast.success('Category has been created!')
        await getCategories();
        setOpen(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Category Name" {...field} />
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

export function CategoryFormDialog({ getCategories }: { getCategories: () => Promise<void> }) {
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
                    <DialogTitle>Add a new Category</DialogTitle>
                </DialogHeader>
                <CategoryForm getCategories={getCategories} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    )
}