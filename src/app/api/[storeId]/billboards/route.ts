import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { label, poster }: { label?: string; poster?: string } =
      await req.json();
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unAuthenticated", { status: 401 });
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
    const newBillboard = await prismaDB.billboard.create({
      data: {
        label,
        poster,
        storeId: params.storeId,
      },
    });
    return NextResponse.json({ message: "Billboard Created.", newBillboard });
  } catch (error) {
    console.log("[POST-BILLBOARD-ERROR] ", error);
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

    const billboards = await prismaDB.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[POST-BILLBOARD-ERROR] ", error);
    return new NextResponse("internall error", { status: 500 });
  }
}
