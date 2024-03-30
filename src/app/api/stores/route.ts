import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { name }: { name?: string } = await req.json();
    if (!userId) {
      return new NextResponse("User is not authenticated", { status: 401 });
    }
    if (!name || typeof name !== "string") {
      return new NextResponse("name is not valid", { status: 400 });
    }
    const doesExits = await prismaDB.store.findFirst({
      where: { name },
    });
    if (doesExits) {
      return new NextResponse("this store has already exists!", {
        status: 400,
      });
    }
    const store = await prismaDB.store.create({
      data: { name, userId: userId },
    });
    return NextResponse.json({ store, message: "store created" });
  } catch (error) {
    console.log(`[STORES_POST]`, error);
    return new NextResponse("internal error", { status: 500 });
  }
}
