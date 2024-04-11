import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

import prismaDB from "@/lib/prismadb";
import { NextResponse } from "next/server";
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
  const { productIds }: { productIds?: string[] } = await req.json();
  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product Ids are required!", { status: 400 });
  }
  const existingProducts = await prismaDB.product.findMany({
    where: { id: { in: productIds } },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  existingProducts.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: { name: product.name },
        unit_amount: Number(product.price) * 100,
      },
    });
  });
  // create order
  const order = await prismaDB.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });
  // create session
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONT_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONT_STORE_URL}/cart?canceled=1`,
    metadata: { orderId: order.id },
  });
  // return response
  return NextResponse.json({ url: session.url }, { headers: corsHeaders });
}
