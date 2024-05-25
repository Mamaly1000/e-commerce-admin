"use client";
import { Store } from "@prisma/client";
import { z } from "zod";
import Heading from "../shared/Heading";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AlertModal } from "../modals/AlertModal";
import ApiAlert from "../shared/ApiAlert";
import useOrigin from "@/hooks/useOrigin";
import ImageUpload from "../ui/ImageUpload";
import { Textarea } from "../ui/textarea";

interface SettingsFormProps {
  initialData: Store;
}
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name cannot be empty" })
    .refine((value) => value.trim().length > 0, {
      message: "Name cannot consist of only whitespace characters",
      path: ["name"],
    }),
  description: z
    .string()
    .min(1, { message: "Description cannot be empty" })
    .refine((value) => value.trim().length > 0, {
      message: "Description cannot consist of only whitespace characters",
      path: ["description"],
    }),
  logo: z.string().min(1, "min character is 1"),
  background_Image: z.string().min(1, "min character is 1"),
});

type SettingsFormValues = z.infer<typeof formSchema>;
const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const router = useRouter();
  const params = useParams();

  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data).then((res) => {
        router.refresh();
        toast.success("store updated!");
      });
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`).then((res) => {
        router.refresh();
        window.location.assign("/");
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
        <Heading
          className="h-fit"
          title="setting"
          description="manage store prefrences"
        />
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
      </section>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8 "
        >
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Store Logo</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onChange={(val) => {
                        field.onChange(val.trim());
                      }}
                      onRemove={() => {
                        field.onChange("");
                      }}
                      disabled={isLoading}
                      max={1}
                      value={[field.value]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="background_Image"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Store Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onChange={(val) => {
                        field.onChange(val.trim());
                      }}
                      onRemove={() => {
                        field.onChange("");
                      }}
                      disabled={isLoading}
                      max={1}
                      value={[field.value]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        placeholder="store name..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isLoading}
                        placeholder="store description..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button type="submit" className="ml-auto" disabled={isLoading}>
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        variant="public"
        description={`${origin}/api/${params.storeId}`}
      />
    </section>
  );
};
export default SettingsForm;
