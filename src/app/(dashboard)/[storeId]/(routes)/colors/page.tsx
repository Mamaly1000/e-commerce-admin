import prismaDB from "@/lib/prismadb";
import React from "react";
import { format } from "date-fns";
import { safeColorType } from "@/types/Color";
import ColorClient from "@/components/clients/color/ColorClient";

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const colors = await prismaDB.color.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  });
  const formattedColors: safeColorType[] = colors.map((s) => ({
    ...s,
    createdAt: format(s.createdAt, "MMMM do, yyyy"),
    updatedAt: format(s.updatedAt, "MMMM do, yyyy"),
  }));
  return <ColorClient sizes={formattedColors} />;
};

export default ColorsPage;
