import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import Navbar from "@/components/navbar";
import prismaDB from "@/lib/prismadb";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismaDB.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      <section className="p-2 md:p-5 pt-6">{children}</section>
    </>
  );
}
