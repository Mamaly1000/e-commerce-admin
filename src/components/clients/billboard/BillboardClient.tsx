"use client";
import React, { FC } from "react";
import Heading from "@/components/shared/Heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { safeBillboardType } from "@/types/Billboard";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { ApiList } from "@/components/shared/ApiList";
interface props {
  billboards: safeBillboardType[];
}

const BillboardClient: FC<props> = ({ billboards = [] }) => {
  const params = useParams();
  const router = useRouter();
  const onAdd = () => {
    router.push(`/${params.storeId}/billboards/new`);
  };
  return (
    <section className="min-w-full max-w-full flex flex-col items-start justify-start gap-5">
      <section className="min-w-full max-w-full flex items-start justify-between gap-2">
        <Heading
          title={`Billboards (${billboards.length})`}
          description="Manage billboards for your store"
          className="h-fit"
        />
        <Button size={"sm"} onClick={onAdd}>
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </section>
      <Separator />
      <DataTable
        data={billboards}
        columns={columns}
        search={{
          key: "label",
          placeHolder: "filter labels...",
        }}
      />
      <Heading
        className="h-fit"
        title="API"
        description="API Calls for Billboards"
      />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </section>
  );
};

export default BillboardClient;
