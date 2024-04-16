"use client";

import { safeOrderType } from "@/types/Order";
import { ColumnDef } from "@tanstack/react-table";
import { sortedHeader } from "@/components/ui/SortedHeader";
import { cn } from "@/lib/utils";
import { statusTypes } from "@/types/payment";

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
    cell: ({ row }) => {
      const status = row.original.status as statusTypes;
      return (
        <span
          className={cn(
            status === "COMPLETED" && " text-green-700 dark:text-green-500",
            status === "CANCELED" && "text-red-500",
            status === "PENDING" && "text-yellow-600 dark:text-yellow-500"
          )}
        >
          {status}
        </span>
      );
    },
  },
];
