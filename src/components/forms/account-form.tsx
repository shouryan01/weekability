import { CalendarIcon, CirclePlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
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
  name: z.string().min(2, {
    message: "Account Name must be at least 2 characters.",
  }),
  type: z.string().min(2, {
    message: "Account Name must be at least 2 characters.",
  }),
  opened: z.coerce.date({ required_error: "Account opened date is required.", }),
  balance: z.coerce.number({
    required_error: "Account Balance is required",
    invalid_type_error: "Account Balance must be a number",
  }).min(0, {
    message: "Account Balance must be minimum $0.00."
  })
})

export function AccountForm({ getAccounts, setOpen }: { getAccounts: () => Promise<void>, setOpen: (open: boolean) => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      type: "",
      opened: new Date(),
      balance: 0,
    },
  })
  
  async function onSubmit(account: z.infer<typeof FormSchema>) {
    try {
        await invoke("create_account", { name: account.name, accountType: account.type, balance: account.balance * 100, opened: account.opened.toISOString().split('T')[0] });
    } catch (error) {
        console.error("Error adding account:", error);
    }
    toast.success('Account has been created!')
    await getAccounts();
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
                <Input placeholder="Account Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Account Type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="opened"
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
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Account Balance $" type="number" step="0.01" {...field} />
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

export function AccountFormDialog({ getAccounts }: { getAccounts: () => Promise<void> }) {
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
          <DialogTitle>Add a new Account</DialogTitle>
        </DialogHeader>
        <AccountForm getAccounts={getAccounts} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}