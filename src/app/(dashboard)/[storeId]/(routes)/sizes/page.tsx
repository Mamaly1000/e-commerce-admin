import prismaDB from "@/lib/prismadb"; 
import React from "react";
import { format } from "date-fns";
import { safeSizeType } from "@/types/Size";
import SizeClient from "@/components/clients/size/SizeClient";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prismaDB.size.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  });
  const formattedSizes: safeSizeType[] = sizes.map((s) => ({
    ...s,
    createdAt: format(s.createdAt, "MMMM do, yyyy"),
    updatedAt: format(s.updatedAt, "MMMM do, yyyy"),
  }));
  return <SizeClient sizes={formattedSizes} />;
};

export default BillboardsPage;
