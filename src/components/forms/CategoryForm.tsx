"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { AlertModal } from "../modals/AlertModal";
import Heading from "../shared/Heading";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface CategoryProps {
  initialData: Category | null;
}
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name cannot be empty" })
    .refine((value) => value.trim().length > 0, {
      message: "Name cannot consist of only whitespace characters",
      path: ["name"],
    }),
  billboardId: z.string().min(1),
});
type CategoryFormValues = z.infer<typeof formSchema>;
const CategoryForm = ({
  initialData,
  billboards,
}: {
  initialData: Category | null;
  billboards: Billboard[];
}) => {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData ? "Edit a Category" : "Add a new Category";
  const toastMessage = initialData ? "Category Updated." : "Category Created.";
  const action = initialData ? "Save changes" : "Create";
  const onSubmit = async (data: CategoryFormValues) => {
    const url = initialData
      ? `/api/${params.storeId}/categories/${params.categoryId}`
      : `/api/${params.storeId}/categories`;
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(url, data).then(() => {
          router.refresh();
          toast.success(toastMessage);
          router.push(`/${params.storeId}/categories`);
        });
      } else {
        await axios.post(url, data).then(() => {
          router.refresh();
          toast.success(toastMessage);
          router.push(`/${params.storeId}/categories`);
        });
      }
    } catch (error: any) {
      toast.error(
        "Make sure you removed all products using this category first."
      );
    } finally {
      setLoading(false);
      router.refresh();
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios
        .delete(`/api/${params.storeId}/categories/${params.categoryId}`)
        .then((res) => {
          window.location.assign(`/${params.storeId}/categories`);
          router.refresh();
          toast.success(res.data.message);
        });
    } catch (error: any) {
      toast.error("Make sure you removed all related products first.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <section className="min-w-full max-w-full flex flex-col items-start justify-start gap-5">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <section className="flex items-start justify-between  min-w-full max-w-full">
        <Heading className="h-fit" title={title} description={description} />
        {!!initialData && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="icon"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </section>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8 "
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="name label..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Billboard Id</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="select a billboard..."
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {billboards.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button type="submit" className="ml-auto" disabled={isLoading}>
            {action}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default CategoryForm;
