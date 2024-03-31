import BillboardClient from "./components/BillboardClient";
import prismaDB from "@/lib/prismadb";
import { safeBillboardType } from "@/types/Billboard";
import React from "react";
import { format } from "date-fns";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismaDB.billboard.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  });
  const formattedBillboards: safeBillboardType[] = billboards.map((b) => ({
    ...b,
    createdAt: format(b.createdAt, "MMMM do, yyyy"),
    updatedAt: format(b.updatedAt, "MMMM do, yyyy"),
  }));
  return <BillboardClient billboards={formattedBillboards} />;
};

export default BillboardsPage;
