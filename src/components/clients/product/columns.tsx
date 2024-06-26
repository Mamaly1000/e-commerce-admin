"use client";

import { cn } from "@/lib/utils";
import CellAction from "./CellAction";
import { safeColorType } from "@/types/Color";
import { ColumnDef } from "@tanstack/react-table";
import { safeProductType } from "@/types/Product";
import Image from "next/image";
import { sortedHeader } from "@/components/ui/SortedHeader";

export type ProductColumnType = Omit<safeProductType, "storeId">;

export const columns: ColumnDef<ProductColumnType>[] = [
  {
    accessorKey: "image",
    header: "image",
    cell: (props) => {
      return (
        <div className="w-[30px] h-[30px] rounded-md drop-shadow-2xl relative aspect-video overflow-hidden ">
          <Image
            src={props.row.original.image}
            alt={props.row.original.name}
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => sortedHeader({ column, label: "name" }),
  },
  {
    accessorKey: "price",
    header: ({ column }) => sortedHeader({ column, label: "price" }),
  },
  {
    accessorKey: "category",
    header: ({ column }) => sortedHeader({ column, label: "category" }),
  },
  {
    accessorKey: "size",
    header: ({ column }) => sortedHeader({ column, label: "size" }),
  },
  {
    accessorKey: "color",
    header: ({ column }) => sortedHeader({ column, label: "color" }),
    cell: (props) => {
      return (
        <div className="flex items-center justify-start gap-2">
          <div
            className={cn(
              "min-w-[20px] min-h-[20px] border-[1px] border-neutral-300 drop-shadow-2xl"
            )}
            style={{ background: props.row.original.color }}
          ></div>
          {props.getValue() as string}
        </div>
      );
    },
  },
  {
    accessorKey: "isFeatured",
    header: "isFeatured",
  },
  {
    accessorKey: "isArchived",
    header: "isArchived",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => sortedHeader({ column, label: "created at" }),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => sortedHeader({ column, label: "updated at" }),
  },
  {
    accessorKey: "actions",
    header: () => {
      return <div className="float-end">actions</div>;
    },
    cell: (props) => <CellAction data={props.row.original} />,
  },
];
