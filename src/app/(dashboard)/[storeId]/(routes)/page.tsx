import prismaDB from "@/lib/prismadb";
import React from "react";

const StorePage = async ({ params }: { params: { storeId?: string } }) => {
  const store = await prismaDB.store.findFirst({
    where: {
      id: params.storeId,
    },
  });
  return <div>store page {store?.name} </div>;
};

export default StorePage;
