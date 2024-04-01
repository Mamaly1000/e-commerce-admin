"use client";
import { ApiList } from "@/components/shared/ApiList";
import Heading from "@/components/shared/Heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { safeCategoryType } from "@/types/Category";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { columns } from "./columns";

const CategoryClient = ({
  categories = [],
}: {
  categories: safeCategoryType[];
}) => {
  const params = useParams();
  const router = useRouter();
  const onAdd = () => {
    router.push(`/${params.storeId}/categories/new`);
  };
  return (
    <section className="min-w-full max-w-full flex flex-col items-start justify-start gap-5">
      <section className="min-w-full max-w-full flex items-start justify-between gap-2">
        <Heading
          title={`Categories (${categories.length})`}
          description="Manage categories for your store"
          className="h-fit"
        />
        <Button size={"sm"} onClick={onAdd}>
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </section>
      <Separator />
      <DataTable
        data={categories}
        columns={columns}
        search={{
          key: "name",
          placeHolder: "filter names...",
        }}
      />
      <Heading
        className="h-fit"
        title="API"
        description="API Calls for Categories"
      />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </section>
  );
};

export default CategoryClient;
