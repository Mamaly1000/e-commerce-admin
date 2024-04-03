"use client";
import React from "react";
import Heading from "@/components/shared/Heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { safeOrderType } from "@/types/Order";
import { columns } from "./columns";

const OrderClient = ({ orders }: { orders: safeOrderType[] }) => {
  return (
    <section className="min-w-full max-w-full flex flex-col items-start justify-start gap-5">
      <section className="min-w-full max-w-full flex items-start justify-between gap-2">
        <Heading
          title={`Orders (${orders.length})`}
          description="Manage Orders for your store"
          className="h-fit"
        />
      </section>
      <Separator />
      <DataTable
        data={orders}
        columns={columns}
        search={{
          key: "products",
          placeHolder: "filter products...",
        }}
      />
    </section>
  );
};

export default OrderClient;
