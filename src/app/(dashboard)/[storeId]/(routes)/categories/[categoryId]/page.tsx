import CategoryForm from "@/components/forms/CategoryForm";
import prismaDB from "@/lib/prismadb";
import React from "react";

const SingleCategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const category = await prismaDB.category.findUnique({
    where: {
      storeId: params.storeId,
      id: params.categoryId,
    },
  });
  const billboards = await prismaDB.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  return <CategoryForm billboards={billboards} initialData={category} />;
};

export default SingleCategoryPage;
