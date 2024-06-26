"use client";

import { cn } from "@/lib/utils";
import CellAction from "./CellAction";
import { safeColorType } from "@/types/Color";
import { ColumnDef } from "@tanstack/react-table";
import { sortedHeader } from "@/components/ui/SortedHeader";

export type ColorColumnType = Omit<safeColorType, "storeId">;

export const columns: ColumnDef<ColorColumnType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => sortedHeader({ column, label: "name" }),
  },
  {
    accessorKey: "value",
    header: ({ column }) => sortedHeader({ column, label: "color" }),
    cell: (props) => {
      return (
        <div className="flex items-center justify-start gap-2">
          <div
            className={cn(
              "min-w-[20px] min-h-[20px] border-[1px] border-neutral-300 drop-shadow-2xl"
            )}
            style={{ background: props.row.original.value }}
          ></div>
          {props.getValue() as string}
        </div>
      );
    },
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
