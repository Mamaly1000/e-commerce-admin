import ColorForm from "@/components/forms/ColorForm";
import prismaDB from "@/lib/prismadb";
import React from "react";

const SingleBillboard = async ({ params }: { params: { colorId: string } }) => {
  const color = await prismaDB.color.findUnique({
    where: { id: params.colorId },
  });
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default SingleBillboard;
