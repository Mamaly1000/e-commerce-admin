import CategoryClient from "@/components/clients/category/CategoryClient";
import prismaDB from "@/lib/prismadb";
import { safeCategoryType } from "@/types/Category";
import { format } from "date-fns";
import React from "react";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await prismaDB.category.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
    include: {
      billboard: {
        select: {
          label: true,
        },
      },
    },
  });
  const formattedcategories: safeCategoryType[] = categories.map((b) => ({
    ...b,
    createdAt: format(b.createdAt, "MMMM do, yyyy"),
    updatedAt: format(b.updatedAt, "MMMM do, yyyy"),
    billboard_label: b.billboard.label,
  }));
  return <CategoryClient categories={formattedcategories} />;
};

export default CategoriesPage;
