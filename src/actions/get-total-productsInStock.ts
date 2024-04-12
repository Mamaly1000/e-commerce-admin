"use server";

import prismaDB from "@/lib/prismadb";

export const getTotalProductsInStock = async (
  storeId: string
): Promise<number> => {
  return await prismaDB.product.count({
    where: {
      isArchived: false,
      storeId,
    },
  });
};
