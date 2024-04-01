"use client";
import { ApiList } from "@/components/shared/ApiList";
import Heading from "@/components/shared/Heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { safeSizeType } from "@/types/Size";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { columns } from "./columns";

const ColorClient = ({ sizes }: { sizes: safeSizeType[] }) => {
  const params = useParams();
  const router = useRouter();
  const onAdd = () => {
    router.push(`/${params.storeId}/colors/new`);
  };
  return (
    <section className="min-w-full max-w-full flex flex-col items-start justify-start gap-5">
      <section className="min-w-full max-w-full flex items-start justify-between gap-2">
        <Heading
          title={`Colors (${sizes.length})`}
          description="Manage Colors for your store"
          className="h-fit"
        />
        <Button size={"sm"} onClick={onAdd}>
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </section>
      <Separator />
      <DataTable
        data={sizes}
        columns={columns}
        search={{
          key: "name",
          placeHolder: "filter names...",
        }}
      />
      <Heading
        className="h-fit"
        title="API"
        description="API Calls for Colors"
      />
      <Separator />
      <ApiList entityName="colors" entityIdName="colorId" />
    </section>
  );
};

export default ColorClient;
