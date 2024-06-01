import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params?: { storeId?: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unAuthenticated", { status: 401 });
    }
    if (!params?.storeId || typeof params?.storeId !== "string") {
      return new NextResponse("store id is required!", { status: 400 });
    }
    const { name } = await req.json();
    if (!name || typeof name !== "string") {
      return new NextResponse("name is required!", { status: 400 });
    }
    const store = await prismaDB.store.updateMany({
      where: { id: params.storeId, userId },
      data: {
        name,
      },
    });
    return NextResponse.json({ message: "store updated", store });
  } catch (error) {
    console.log("[PATCH-ERROR-STORE-ID]", error);
    return new NextResponse("internall error", { status: 500 });
  }
}
export async function DELETE(
  _req: Request,
  { params }: { params?: { storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!params?.storeId || typeof params?.storeId !== "string") {
      return new NextResponse("invalid id", { status: 400 });
    }
    const store = await prismaDB.store.delete({
      where: { id: params.storeId, userId },
    });
    return NextResponse.json({ message: "store deleted", store });
  } catch (error) {
    console.log("[DELETE-ERROR-STORE-ID]", error);
    return new NextResponse("internall error", { status: 500 });
  }
}
export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("storeId is required!", { status: 400 });
    }

    const store = await prismaDB.store.findUnique({
      where: {
        id: params.storeId,
      },
      include: {
        orders: {
          select: {
            isPaid: true,
            orderItems: {
              select: {
                product: true,
              },
            },
          },
        },
        products: {
          select: { id: true },
        },
      },
    });
    if (!store) {
      return new NextResponse("store not found!", { status: 400 });
    }
    const store_with_analytic = {
      name: store.name,
      id: store.id,
      description: store.description,
      background_Image: store.background_Image,
      logo: store.logo,
      total_revenue: store.orders
        .filter((order) => order.isPaid)
        .reduce((acc, current) => {
          return (acc += current.orderItems.reduce((acc, current) => {
            return (acc += current.product.price);
          }, 0));
        }, 0),
      total_sell_products: store.orders
        .filter((order) => order.isPaid)
        .reduce((acc, current) => {
          return (acc += current.orderItems.length);
        }, 0),
    };
    return NextResponse.json(store_with_analytic);
  } catch (error) {
    console.log("[STORE-GET-ERROR] ", error);
    return new NextResponse("internall error", { status: 500 });
  }
}
