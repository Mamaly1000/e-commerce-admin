import SizeForm from "@/components/forms/SizeForm";
import prismaDB from "@/lib/prismadb";
import React from "react";

const SingleBillboard = async ({ params }: { params: { sizeId: string } }) => {
  const size = await prismaDB.size.findUnique({
    where: { id: params.sizeId },
  });
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SingleBillboard;
