import { createFileRoute } from '@tanstack/react-router'
import {useEffect, useState} from "react";
import {type Category} from "@/lib/types.ts";
import {invoke} from "@tauri-apps/api/core";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Trash} from "lucide-react";
import {toast} from "sonner";
import {CategoryFormDialog} from "@/components/forms/category-form.tsx";
import {Input} from "@/components/ui/input.tsx";

export const Route = createFileRoute('/settings')({
  component: Settings,
})

function Settings() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async (): Promise<void> => {
        try {
            const categories = (await invoke("get_categories")) as Category[];
            setCategories(categories);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    };

    const updateCategory = async (id: number, name: string): Promise<void> => {
        try {
            await invoke("update_category", { id, name });
            toast.success('Category has been updated!')
            getCategories();
        } catch (error) {
            console.error("Error updating category", error);
        }
    };

    const deleteCategory = async (id: number): Promise<void> => {
        try {
            await invoke("delete_category", { id });
            getCategories();
        } catch (error) {
            console.error("Error deleting category", error);
        }
        toast.error('Category is used in a transaction, unable to delete.');
    };

  return (
    <div className="flex justify-center min-h-screen w-screen">
      <div>
        <div className="flex flex-col items-center min-h-screen text-center mt-5">
          <h1 className="text-3xl mb-8">Categories</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-left">
                    {categories.map((category: Category) => (
                        <TableRow key={category.id} className="mb-2">
                            <TableCell>
                                <Input
                                    type="text"
                                    defaultValue={category.name}
                                    onBlur={(e) => {
                                        updateCategory(category.id, e.target.value);
                                    }}
                                />
                            </TableCell>

                            <TableCell className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => deleteCategory(category.id)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <CategoryFormDialog getCategories={getCategories} />
        </div>
      </div>
    </div>
  )
}