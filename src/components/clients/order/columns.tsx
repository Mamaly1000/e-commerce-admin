"use client";

import { safeOrderType } from "@/types/Order";
import { ColumnDef } from "@tanstack/react-table";
import { sortedHeader } from "@/components/ui/SortedHeader";

export type OrderColumnType = Omit<safeOrderType, "storeId">;

export const columns: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "products",
    header: ({ column }) => sortedHeader({ column, label: "products" }),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => sortedHeader({ column, label: "phone" }),
  },
  {
    accessorKey: "address",
    header: ({ column }) => sortedHeader({ column, label: "address" }),
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => sortedHeader({ column, label: "totalPrice" }),
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => sortedHeader({ column, label: "createdAt" }),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => sortedHeader({ column, label: "updatedAt" }),
  },
  {
    accessorKey: "status",
    header: "status",
  },
];
