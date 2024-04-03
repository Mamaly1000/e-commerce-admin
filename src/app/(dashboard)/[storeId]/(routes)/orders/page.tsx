import prismaDB from "@/lib/prismadb";
import React from "react";
import { format } from "date-fns";
import { safeOrderType } from "@/types/Order";
import OrderClient from "@/components/clients/order/OrderClient";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismaDB.order.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
  const formattedOrders: safeOrderType[] = orders.map((s) => ({
    storeId: s.storeId,
    id: s.id,
    phone: s.phone,
    address: s.address,
    isPaid: s.isPaid,
    createdAt: format(s.createdAt, "MMMM do, yyyy"),
    updatedAt: format(s.updatedAt, "MMMM do, yyyy"),
    products: s.orderItems.map((p) => p.product.name).join(", "),
    totalPrice: formatter.format(
      s.orderItems.reduce((acc, current) => {
        return (acc += Number(current.product.price));
      }, 0)
    ),
  }));
  return <OrderClient orders={formattedOrders} />;
};

export default OrdersPage;
