"use client";

import { cn } from "@/lib/utils";
import CellAction from "./CellAction";
import { safeOrderType } from "@/types/Order";
import { ColumnDef } from "@tanstack/react-table";

export type OrderColumnType = Omit<safeOrderType, "storeId">;

export const columns: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "createdAt",
    header: "created at",
  },
  {
    accessorKey: "updatedAt",
    header: "updated at",
  },
  {
    accessorKey: "status",
    header: "status",
  },
];
