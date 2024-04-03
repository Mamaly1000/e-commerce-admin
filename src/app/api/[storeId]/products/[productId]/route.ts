import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    if (!params?.productId) {
      return new NextResponse("invalid id", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("storeId is required!", { status: 400 });
    }

    const product = await prismaDB.product.findUnique({
      where: {
        storeId: params.storeId,
        id: params.productId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log(`[PRODUCT-GET-ERROR] `, error);
    return new NextResponse("internall error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
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
    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!params?.productId) {
      return new NextResponse("invalid id", { status: 400 });
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
    await prismaDB.product.update({
      where: {
        storeId: params.storeId,
        id: params.productId,
      },
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
          deleteMany: {},
        },
      },
    });
    const updatedProduct = await prismaDB.product.update({
      where: {
        id: params.productId,
      },
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
    return NextResponse.json({
      message: "Product updated",
      updatedProduct,
    });
  } catch (error) {
    console.log(`[PRODUCT-PATCH-ERROR] `, error);
    return new NextResponse("internall error", { status: 500 });
  }
}
export async function DELETE(
  _req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!params?.productId) {
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
    const deletedProduct = await prismaDB.product.delete({
      where: {
        storeId: params.storeId,
        id: params.productId,
      },
    });
    return NextResponse.json({
      message: "Product deleted",
      deletedProduct,
    });
  } catch (error) {
    console.log(`[PRODUCT-DELETE-ERROR] `, error);
    return new NextResponse("internall error", { status: 500 });
  }
}
