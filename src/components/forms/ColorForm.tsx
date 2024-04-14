"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { FC, useState } from "react";
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
} from "../ui/form";
import { Input } from "../ui/input";

interface props {
  initialData: Color | null;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name cannot be empty" })
    .refine((value) => value.trim().length > 0, {
      message: "Name cannot consist of only whitespace characters",
      path: ["name"],
    }),
  value: z.string().min(1, "value must contain at least one character."),
});
type ColorFormValues = z.infer<typeof formSchema>;
const ColorForm: FC<props> = ({ initialData }) => {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const title = initialData ? "Edit Color" : "Create Color";
  const description = initialData ? "Edit a Color" : "Add a new Color";
  const toastMessage = initialData ? "Color Updated." : "Color Created.";
  const action = initialData ? "Save changes" : "Create";
  const onSubmit = async (data: ColorFormValues) => {
    const url = initialData
      ? `/api/${params.storeId}/colors/${params.ColorId}`
      : `/api/${params.storeId}/colors`;
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(url, data).then(() => {
          router.refresh();
          toast.success(toastMessage);
          router.push(`/${params.storeId}/colors`);
        });
      } else {
        await axios.post(url, data).then(() => {
          router.refresh();
          toast.success(toastMessage);
          router.push(`/${params.storeId}/colors`);
        });
      }
    } catch (error: any) {
      toast.error("Make sure you removed all products using this Color first.");
    } finally {
      setLoading(false);
      router.refresh();
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios
        .delete(`/api/${params.storeId}/colors/${params.ColorId}`)
        .then((res) => {
          router.refresh();
          window.location.assign(`/${params.storeId}/colors`);
          toast.success(res.data.message);
        });
    } catch (error: any) {
      toast.error("Make sure you removed all products using this Color first");
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
                        placeholder="name..."
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
              name="value"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-start gap-2">
                        <div
                          className="min-w-[20px] min-h-[20px] border-[1px] border-neutral-300 drop-shadow-2xl"
                          style={{ background: field.value || "#000000" }}
                        ></div>
                        <Input
                          disabled={isLoading}
                          placeholder="value..."
                          {...field}
                        />
                      </div>
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

export default ColorForm;
