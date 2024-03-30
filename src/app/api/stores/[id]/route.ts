import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params?: { id?: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unAuthenticated", { status: 401 });
    }
    if (!params?.id || typeof params?.id !== "string") {
      return new NextResponse("store id is required!", { status: 400 });
    }
    const { name } = await req.json();
    if (!name || typeof name !== "string") {
      return new NextResponse("name is required!", { status: 400 });
    }
    const store = await prismaDB.store.updateMany({
      where: { id: params.id, userId },
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
  { params }: { params?: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!params?.id || typeof params?.id !== "string") {
      return new NextResponse("invalid id", { status: 400 });
    }
    const store = await prismaDB.store.delete({
      where: { id: params.id, userId },
    });
    return NextResponse.json({ message: "store deleted", store });
  } catch (error) {
    console.log("[DELETE-ERROR-STORE-ID]", error);
    return new NextResponse("internall error", { status: 500 });
  }
}
