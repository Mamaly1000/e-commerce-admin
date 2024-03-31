import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!params?.billboardId) {
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
    const billboard = await prismaDB.billboard.findUnique({
      where: {
        storeId: params.storeId,
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[BILLBOARD-GET-ERROR] `, error);
    return new NextResponse("internall error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const { label, poster }: { label?: string; poster?: string } =
      await req.json();
    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!params?.billboardId) {
      return new NextResponse("invalid id", { status: 400 });
    }
    if (!label || !poster) {
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
    const updatedBillboard = await prismaDB.billboard.update({
      where: {
        storeId: params.storeId,
        id: params.billboardId,
      },
      data: {
        label,
        poster,
      },
    });
    return NextResponse.json({
      message: "billboard updated",
      updatedBillboard,
    });
  } catch (error) {
    console.log(`[BILLBOARD-PATCH-ERROR] `, error);
    return new NextResponse("internall error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!params?.billboardId) {
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
    const deletedBillboard = await prismaDB.billboard.delete({
      where: {
        storeId: params.storeId,
        id: params.billboardId,
      },
    });
    return NextResponse.json({
      message: "billboard deleted",
      deletedBillboard,
    });
  } catch (error) {
    console.log(`[BILLBOARD-DELETE-ERROR] `, error);
    return new NextResponse("internall error", { status: 500 });
  }
}
