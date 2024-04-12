"use server";

import prismaDB from "@/lib/prismadb";

export const getTotalSales = async (storeId: string): Promise<number> => {
  return await prismaDB.order.count({
    where: {
      isPaid: true,
      storeId,
    },
  });
};
