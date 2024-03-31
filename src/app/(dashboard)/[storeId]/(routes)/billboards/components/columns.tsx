"use client";

import { safeBillboardType } from "@/types/Billboard";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import CellAction from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumnType = Omit<safeBillboardType, "storeId">;

export const columns: ColumnDef<BillboardColumnType>[] = [
  {
    accessorKey: "poster",
    header: "poster",
    cell: (props) => {
      return (
        <div className="w-[50px] h-[50px] overflow-hidden relative aspect-video rounded-md">
          <Image fill src={props.getValue() as string} alt="image" />{" "}
        </div>
      );
    },
  },
  {
    accessorKey: "label",
    header: "label",
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
    header: (props) => {
      return <div className="float-end">actions</div>;
    },
    cell: (props) => <CellAction data={props.row.original} />,
  },
];
