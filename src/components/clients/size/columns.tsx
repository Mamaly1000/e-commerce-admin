"use client";

import CellAction from "./CellAction";
import { safeSizeType } from "@/types/Size";
import { ColumnDef } from "@tanstack/react-table";

export type SizeColumnType = Omit<safeSizeType, "storeId">;

export const columns: ColumnDef<SizeColumnType>[] = [
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "value",
    header: "value",
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
