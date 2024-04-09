import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const {
      categoryId,
      colorId,
      images,
      name,
      price,
      sizeId,
      isArchived,
      isFeatured,
    }: {
      name: string;
      images: {
        url: string;
      }[];
      price: number;
      categoryId: string;
      colorId: string;
      sizeId: string;
      isFeatured?: boolean | undefined;
      isArchived?: boolean | undefined;
    } = await req.json();
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unAuthenticated", { status: 401 });
    }
    if (
      !!!categoryId ||
      !!!colorId ||
      !!!images ||
      !!!name ||
      !!!price ||
      !!!sizeId ||
      !images.length
    ) {
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
    const newProduct = await prismaDB.product.create({
      data: {
        categoryId,
        sizeId,
        colorId,
        price,
        name,
        isArchived,
        isFeatured,
        storeId: params.storeId,
        images: {
          createMany: {
            data: images.map((image) => ({
              url: image.url,
            })),
          },
        },
      },
    });
    return NextResponse.json({ message: "Product Created.", newProduct });
  } catch (error) {
    console.log("[POST-PRODUCT-ERROR] ", error);
    return new NextResponse("internall error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismaDB.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
