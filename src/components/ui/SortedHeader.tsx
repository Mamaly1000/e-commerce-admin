"use client";
import { Column } from "@tanstack/react-table";
import { Button } from "./button";
import { ArrowDownUp, ArrowUpDown } from "lucide-react";
export const sortedHeader = <T,>({
  column,
  label,
}: {
  label: string;
  column: Column<T, unknown>;
}) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      {column.getIsSorted() === "asc" ? (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowDownUp className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
};
