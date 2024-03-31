import BillboardForm from "@/components/forms/BillboardForm";
import prismaDB from "@/lib/prismadb";
import React from "react";

const SingleBillboard = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const billboard = await prismaDB.billboard.findUnique({
    where: { id: params.billboardId },
  });
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default SingleBillboard;
