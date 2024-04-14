"use client";
import React, { FC, useState } from "react";
import { BillboardColumnType } from "./columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AlertModal } from "@/components/modals/AlertModal";

interface props {
  data: BillboardColumnType;
}

const CellAction: FC<props> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (description: string) => {
    navigator.clipboard.writeText(description);
    toast.success("Billboard ID copied to the clipboard");
  };
  const onEdit = (id: string) => {
    router.push(`/${params.storeId}/billboards/${id}`);
  };
  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios
        .delete(`/api/${params.storeId}/billboards/${id}`)
        .then((res) => {
          router.refresh();
          toast.success(res.data.message);
        });
    } catch (error: any) {
      toast.error("Make sure you removed all products and categories first.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete(data.id)}
        loading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="float-end" asChild>
          <Button variant={"ghost"} className="w-8 h-8 p-0">
            <span className="sr-only">open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            disabled={isLoading}
            onClick={() => onCopy(data.id)}
            className="capitalize text-sky-500"
          >
            <Copy className="mr-2 w-4 h-4" />
            copy id
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isLoading}
            onClick={() => onEdit(data.id)}
            className="capitalize text-yellow-500"
          >
            <Edit className="mr-2 w-4 h-4" />
            edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isLoading}
            onClick={() => setOpen(true)}
            className="capitalize text-red-500"
          >
            <Trash className="mr-2 w-4 h-4" />
            delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
