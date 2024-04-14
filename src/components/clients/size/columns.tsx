"use client";

import { sortedHeader } from "@/components/ui/SortedHeader";
import CellAction from "./CellAction";
import { safeSizeType } from "@/types/Size";
import { ColumnDef } from "@tanstack/react-table";

export type SizeColumnType = Omit<safeSizeType, "storeId">;

export const columns: ColumnDef<SizeColumnType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => sortedHeader({ column, label: "name" }),
  },
  {
    accessorKey: "value",
    header: ({ column }) => sortedHeader({ column, label: "value" }),
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
