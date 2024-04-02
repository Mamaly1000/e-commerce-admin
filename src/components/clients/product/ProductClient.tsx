"use client";
import { ApiList } from "@/components/shared/ApiList";
import Heading from "@/components/shared/Heading";
import { Separator } from "@/components/ui/separator";
import { safeProductType } from "@/types/Product";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductClient = ({ products }: { products: safeProductType[] }) => {
  const params = useParams();
  const router = useRouter();
  const onAdd = () => {
    router.push(`/${params.storeId}/products/new`);
  };
  return (
    <section className="min-w-full max-w-full flex flex-col items-start justify-start gap-5">
      <section className="min-w-full max-w-full flex items-start justify-between gap-2">
        <Heading
          title={`Products (${products.length})`}
          description="Manage Products for your store"
          className="h-fit"
        />
        <Button size={"sm"} onClick={onAdd}>
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </section>
      <Separator />
      <DataTable
        data={products}
        columns={columns}
        search={{
          key: "name",
          placeHolder: "filter names...",
        }}
      />
      <Heading
        className="h-fit"
        title="API"
        description="API Calls for Products"
      />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </section>
  );
};

export default ProductClient;
