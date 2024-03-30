import SettingsForm from "@/components/forms/SettingsForm";
import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const SettingsPage = async ({ params }: { params: { storeId?: string } }) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const store = await prismaDB.store.findFirst({
    where: { id: params.storeId, userId },
  });
  if (!store) {
    redirect("/");
  }
  return <SettingsForm initialData={store} />;
};

export default SettingsPage;
