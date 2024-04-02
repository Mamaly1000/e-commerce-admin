import prismaDB from "@/lib/prismadb";
import React from "react";
import { format } from "date-fns";
import { safeProductType } from "@/types/Product";
import { formatter } from "@/lib/utils";
import ProductClient from "@/components/clients/product/ProductClient";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismaDB.product.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      size: true,
      color: true,
      images: {
        take: 1,
      },
    },
  });
  const formattedProducts: safeProductType[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    isFeatured: p.isFeatured,
    isArchived: p.isArchived,
    price: formatter.format(p.price),
    category: p.category.name,
    size: p.size.name,
    color: p.color.value,
    createdAt: format(p.createdAt, "MMMM do, yyyy"),
    updatedAt: format(p.updatedAt, "MMMM do, yyyy"),
    image: p.images[0].url,
  }));
  return <ProductClient products={formattedProducts} />;
};

export default ProductsPage;
