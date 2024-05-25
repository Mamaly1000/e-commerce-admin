import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismaDB from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      background_Image,
      description,
      logo,
    }: {
      name?: string;
      background_Image?: string;
      description?: string;
      logo?: string;
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name || typeof name !== "string") {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!background_Image || typeof background_Image !== "string") {
      return new NextResponse("background image is not valid", { status: 400 });
    }
    if (!description || typeof description !== "string") {
      return new NextResponse("description is not valid", { status: 400 });
    }

    if (!logo || typeof logo !== "string") {
      return new NextResponse("logo is not valid", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prismaDB.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
        background_Image,
        description,
        logo,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prismaDB.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
