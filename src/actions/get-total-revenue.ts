"use server";

import prismaDB from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string): Promise<number> => {
  const paidOrders = await prismaDB.order.findMany({
    where: {
      isPaid: true,
      storeId,
    },
    include: { orderItems: { include: { product: true } } },
  });
  const totalRevenue = paidOrders.reduce((total, currentOrder) => {
    const orderTotal = currentOrder.orderItems.reduce((orderSum, item) => {
      return (orderSum += Number(item.product.price));
    }, 0);
    return (total += orderTotal);
  }, 0);
  return totalRevenue;
};
