import prismaDB from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { statusTypes } from "../../../../types/payment";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const {
    productIds,
    status,
    orderId,
    phone,
    address,
  }: {
    phone?: string;
    address?: string;
    orderId?: string;
    status: statusTypes;
    productIds?: string[];
  } = await req.json();

  if (status === "PENDING") {
    if (!productIds || productIds.length === 0) {
      return new NextResponse("Product Ids are required!", { status: 400 });
    }

    const existingProducts = await prismaDB.product.findMany({
      where: { id: { in: productIds } },
    });
    if (!productIds) {
      return new NextResponse("products id are required!", { status: 400 });
    }
    const order = await prismaDB.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        status,
        orderItems: {
          create: existingProducts.map((product) => ({
            product: {
              connect: {
                id: product.id,
              },
            },
          })),
        },
      },
    });
    return NextResponse.json(
      {
        message: `Order is in pending status.`,
        url: `${process.env.FRONT_STORE_URL}/cart?${status}=1`,
        orderId: order.id,
      },
      { headers: corsHeaders }
    );
  }
  if (status === "CANCELED" && orderId) {
    await prismaDB.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELED",
      },
    });
    return NextResponse.json(
      {
        message: `Order is in cancel status.`,
        url: `${process.env.FRONT_STORE_URL}/cart?${status}=1`,
      },
      { headers: corsHeaders }
    );
  }
  if (status === "COMPLETED" && orderId && address && phone) {
    await prismaDB.order.update({
      where: { id: orderId, storeId: params.storeId },
      data: {
        address,
        phone,
        status: "COMPLETED",
        isPaid: true,
      },
    });
    return NextResponse.json(
      {
        message: `Order is in success status.`,
        url: `${process.env.FRONT_STORE_URL}/cart?${status}=1`,
      },
      { headers: corsHeaders }
    );
  }
}
