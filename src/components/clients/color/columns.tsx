"use client";

import CellAction from "./CellAction";
import { safeColorType } from "@/types/Color";
import { ColumnDef } from "@tanstack/react-table";

export type ColorColumnType = Omit<safeColorType, "storeId">;

export const columns: ColumnDef<ColorColumnType>[] = [
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
