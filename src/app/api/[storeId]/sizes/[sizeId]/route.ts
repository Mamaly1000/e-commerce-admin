import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    if (!params?.sizeId) {
      return new NextResponse("invalid id", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("storeId is required!", { status: 400 });
    }

    const size = await prismaDB.size.findUnique({
      where: {
        storeId: params.storeId,
        id: params.sizeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log(`[SIZE-GET-ERROR] `, error);
    return new NextResponse("internall error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const { name, value }: { name?: string; value?: string } = await req.json();
    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!params?.sizeId) {
      return new NextResponse("invalid id", { status: 400 });
    }
    if (!name || !value) {
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
    const updatedSize = await prismaDB.size.update({
      where: {
        storeId: params.storeId,
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json({
      message: "size updated",
      updatedSize,
    });
  } catch (error) {
    console.log(`[SIZE-PATCH-ERROR] `, error);
    return new NextResponse("internall error", { status: 500 });
  }
}
export async function DELETE(
  _req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!params?.sizeId) {
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
    const deletedSize = await prismaDB.size.delete({
      where: {
        storeId: params.storeId,
        id: params.sizeId,
      },
    });
    return NextResponse.json({
      message: "color deleted",
      deletedSize,
    });
  } catch (error) {
    console.log(`[SIZE-DELETE-ERROR] `, error);
    return new NextResponse("internall error", { status: 500 });
  }
}
