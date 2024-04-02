import ProductForm from "@/components/forms/ProductForm";
import prismaDB from "@/lib/prismadb";
import React from "react";

const SingleBillboard = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const where: any = { storeId: params.storeId };
  const product = await prismaDB.product.findUnique({
    where: { id: params.productId },
    include: {
      category: true,
      size: true,
      color: true,
      images: true,
    },
  });
  const categories = await prismaDB.category.findMany({
    where,
  });
  const sizes = await prismaDB.size.findMany({
    where,
  });
  const colors = await prismaDB.color.findMany({
    where,
  });
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4p-8 pt-6">
        <ProductForm
          colors={colors}
          sizes={sizes}
          categories={categories}
          initialData={product}
        />
      </div>
    </div>
  );
};

export default SingleBillboard;
