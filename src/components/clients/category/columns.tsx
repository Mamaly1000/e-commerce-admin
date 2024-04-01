"use client";

import CellAction from "./CellAction";
import { safeCategoryType } from "@/types/Category";
import { ColumnDef } from "@tanstack/react-table"; 

export type CategoryColumnType = Omit<safeCategoryType, "storeId">;

export const columns: ColumnDef<CategoryColumnType>[] = [
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "billboard_label",
    header: "billboard label",
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
    accessorKey: "actions",
    header: () => {
      return <div className="float-end">actions</div>;
    },
    cell: (props) => <CellAction data={props.row.original} />,
  },
];
