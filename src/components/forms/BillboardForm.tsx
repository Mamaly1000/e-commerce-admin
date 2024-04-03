"use client";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Trash } from "lucide-react";
import Heading from "../shared/Heading";
import { AlertModal } from "../modals/AlertModal";
import axios from "axios";
import { toast } from "react-toastify";
import { z } from "zod";
import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUpload from "../ui/ImageUpload";

interface BillboardProps {
  initialData: Billboard | null;
}
const formSchema = z.object({
  label: z
    .string()
    .min(1, { message: "Name cannot be empty" })
    .refine((value) => value.trim().length > 0, {
      message: "Name cannot consist of only whitespace characters",
      path: ["name"],
    }),
  poster: z
    .string()
    .min(1, "billboard must contain at least one poster image."),
});
type BillboardFormValues = z.infer<typeof formSchema>;
const BillboardForm: React.FC<BillboardProps> = ({ initialData }) => {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      poster: "",
      label: "",
    },
  });

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit a Billboard" : "Add a new Billboard";
  const toastMessage = initialData
    ? "Billboard Updated."
    : "Billboard Created.";
  const action = initialData ? "Save changes" : "Create";
  const onSubmit = async (data: BillboardFormValues) => {
    const url = initialData
      ? `/api/${params.storeId}/billboards/${params.billboardId}`
      : `/api/${params.storeId}/billboards`;
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(url, data).then(() => {
          router.refresh();
          toast.success(toastMessage);
          router.push(`/${params.storeId}/billboards`);
        });
      } else {
        await axios.post(url, data).then(() => {
          router.refresh();
          toast.success(toastMessage);
          router.push(`/${params.storeId}/billboards`);
        });
      }
    } catch (error: any) {
      toast.error(
        "Make sure you removed all categories using this billboard first."
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
        .delete(
          `/api/${params.storeId}/billboards/${params.billboardId}`
        )
        .then((res) => {
          router.refresh();
          window.location.assign(`/${params.storeId}/billboards`);
          toast.success(res.data.message);
        });
    } catch (error: any) {
      toast.error("Make sure you removed all products and categories first.");
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="billboard label..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <FormField
            control={form.control}
            name="poster"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={!!field.value ? [field.value] : []}
                      onChange={(val) => field.onChange(val)}
                      onRemove={() => field.onChange("")}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" className="ml-auto" disabled={isLoading}>
            {action}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default BillboardForm;
