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

const formSchema = z.object({
  name: z.string().min(1).trim(),
});

const CreateStoreModal = () => {
  const { onClose, isOpen } = useStoreModal();
  const [isLoading, setLoading] = useState(false);

  const formState = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.name.trim().length !== 0) {
      setLoading(true);
      await axios
        .post("/api/stores", values)
        .then((res) => {
          toast.success(res.data.message);
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
            <form onSubmit={formState.handleSubmit(onSubmit)}>
              <FormField
                control={formState.control}
                name="name"
                disabled={isLoading}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder={isLoading ? "disabled" : "E-Commerce"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
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
