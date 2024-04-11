import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    if (!params?.categoryId) {
      return new NextResponse("invalid id", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("storeId is required!", { status: 400 });
    }

    const category = await prismaDB.category.findUnique({
      where: {
        storeId: params.storeId,
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log(`[CATEGORY-GET-ERROR] `, error);
    return new NextResponse("internall error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const { name, billboardId }: { name?: string; billboardId?: string } =
      await req.json();
    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!params?.categoryId) {
      return new NextResponse("invalid id", { status: 400 });
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
    const updatedCategory = await prismaDB.category.update({
      where: {
        storeId: params.storeId,
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });
    return NextResponse.json({
      message: "category updated",
      updatedCategory,
    });
  } catch (error) {
    console.log(`[CATEGORY-PATCH-ERROR] `, error);
    return new NextResponse("internall error", { status: 500 });
  }
}
export async function DELETE(
  _req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!params?.categoryId) {
      return new NextResponse("invalid id", { status: 400 });
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
    const deletedCategory = await prismaDB.category.delete({
      where: {
        storeId: params.storeId,
        id: params.categoryId,
      },
    });
    return NextResponse.json({
      message: "category deleted",
      deletedCategory,
    });
  } catch (error) {
    console.log(`[CATEGORY-DELETE-ERROR] `, error);
    return new NextResponse("internall error", { status: 500 });
  }
}
