"use client";

import { sortedHeader } from "@/components/ui/SortedHeader";
import CellAction from "./CellAction";
import { safeCategoryType } from "@/types/Category";
import { ColumnDef } from "@tanstack/react-table";

export type CategoryColumnType = Omit<safeCategoryType, "storeId">;

export const columns: ColumnDef<CategoryColumnType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => sortedHeader({ column, label: "name" }),
  },
  {
    accessorKey: "billboard_label",
    header: ({ column }) => sortedHeader({ column, label: "billboard label" }),
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
