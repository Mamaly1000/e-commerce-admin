import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { name, billboardId }: { name?: string; billboardId?: string } =
      await req.json();
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unAuthenticated", { status: 401 });
    }
    if (!name || !billboardId) {
      return new NextResponse("fields values are missing!", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("storeId is required!", { status: 400 });
    }
    const isUserStore = await prismaDB.store.findFirst({
      where: {
        userId,
        id: params.storeId,
      },
    });
    if (!isUserStore) {
      return new NextResponse("unAuthorized", { status: 403 });
    }
    const newCategory = await prismaDB.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });
    return NextResponse.json({ message: "Category Created.", newCategory });
  } catch (error) {
    console.log("[POST-CATEGORY-ERROR] ", error);
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

    const categories = await prismaDB.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.log("[GET-CATEGORY-ERROR] ", error);
    return new NextResponse("internall error", { status: 500 });
  }
}
