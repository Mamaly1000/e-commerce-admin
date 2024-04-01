import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { colorId: string; storeId: string } }
) {
  try {
    if (!params?.colorId) {
      return new NextResponse("invalid id", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("storeId is required!", { status: 400 });
    }

    const color = await prismaDB.color.findUnique({
      where: {
        storeId: params.storeId,
        id: params.colorId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log(`[COLOR-GET-ERROR] `, error);
    return new NextResponse("internall error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const { name, value }: { name?: string; value?: string } = await req.json();
    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!params?.colorId) {
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
    const updatedColor = await prismaDB.color.update({
      where: {
        storeId: params.storeId,
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json({
      message: "color updated",
      updatedColor,
    });
  } catch (error) {
    console.log(`[COLOR-PATCH-ERROR] `, error);
    return new NextResponse("internall error", { status: 500 });
  }
}
export async function DELETE(
  _req: Request,
  { params }: { params: { colorId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!params?.colorId) {
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
    const deletedColor = await prismaDB.color.delete({
      where: {
        storeId: params.storeId,
        id: params.colorId,
      },
    });
    return NextResponse.json({
      message: "color deleted",
      deletedColor,
    });
  } catch (error) {
    console.log(`[COLOR-DELETE-ERROR] `, error);
    return new NextResponse("internall error", { status: 500 });
  }
}
