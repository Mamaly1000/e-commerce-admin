import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const {
      name,
      description,
    }: {
      name?: string;
      description?: string;
    } = await req.json();
    if (!userId) {
      return new NextResponse("User is not authenticated", { status: 401 });
    }
    if (!name || typeof name !== "string") {
      return new NextResponse("name is not valid", { status: 400 });
    }
    if (!description || typeof description !== "string") {
      return new NextResponse("description is not valid", { status: 400 });
    }

    const doesExits = await prismaDB.store.findFirst({
      where: { name },
    });
    if (doesExits) {
      return new NextResponse("this store has already exists!", {
        status: 400,
      });
    }
    const store = await prismaDB.store.create({
      data: {
        name,
        userId: userId,
        description,
        background_Image: "",
        logo: "",
      },
    });
    return NextResponse.json({ store, message: "store created" });
  } catch (error) {
    console.log(`[STORES_POST]`, error);
    return new NextResponse("internal error", { status: 500 });
  }
}
export async function GET() {
  try {
    const stores = await prismaDB.store.findMany({
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
    const storesWith_Analytic = stores.map((store) => ({
      id: store.id,
      name: store.name,
      description: store.description,
      background_Image: store.background_Image,
      logo: store.logo,
      total_revenue: store.orders.reduce((acc, current) => {
        return (acc += current.orderItems.reduce((acc, current) => {
          return (acc += current.product.price);
        }, 0));
      }, 0),
      total_sell_products: store.orders.reduce((acc, current) => {
        return (acc += current.orderItems.length);
      }, 0),
    }));
    return NextResponse.json(storesWith_Analytic);
  } catch (error) {
    console.log(`[ERROR-GET-STORES]`, error);
    return new NextResponse("internall error!", { status: 500 });
  }
}
