"use client";
import React, { useState } from "react";
import Modal from "@/components/modals/Modal";
import { useStoreModal } from "@/hooks/useStoreModal";
import { toast } from "react-toastify";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { Textarea } from "../ui/textarea"; 

const formSchema = z.object({
  name: z.string().min(1).trim(),
  description: z.string().min(1).trim(),
});

const CreateStoreModal = () => {
  const { onClose, isOpen } = useStoreModal();
  const [isLoading, setLoading] = useState(false);

  const formState = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.name.trim().length !== 0) {
      setLoading(true);
      await axios
        .post("/api/stores", values)
        .then((res) => {
          toast.success(res.data.message);
          window.location.assign(`/${res.data.store.id}`);
          onClose();
          formState.reset();
        })
        .catch((error) => {
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("something went wrong!");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.error("please write a valid name!");
    }
  };
  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...formState}>
            <form
              className="relative z-20"
              onSubmit={formState.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-8">
                <FormField
                  control={formState.control}
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
                  control={formState.control}
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
              <div className="pt-6 space-x-2 flex items-center justify-end ">
                <Button
                  disabled={isLoading}
                  variant="outline"
                  onClick={onClose}
                >
                  cancel
                </Button>
                <Button disabled={isLoading} type="submit">
                  continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default CreateStoreModal;
