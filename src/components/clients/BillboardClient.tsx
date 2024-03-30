"use client";
import React from "react";
import Heading from "../shared/Heading";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const BillboardClient = () => {
  const params = useParams();
  const router = useRouter();
  const onAdd = () => {
    router.push(`/${params.storeId}/billboards/new`);
  };
  return (
    <section className="min-w-full max-w-full flex flex-col items-start justify-start gap-5">
      <section className="min-w-full max-w-full flex items-start justify-between gap-2">
        <Heading
          title="Billboards (0)"
          description="Manage billboards for your store"
          className="h-fit"
        />
        <Button size={"sm"} onClick={onAdd}>
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </section>
    </section>
  );
};

export default BillboardClient;
