import React from "react";

import { getTotalRevenue } from "@/actions/get-total-revenue";
import Heading from "@/components/shared/Heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { CreditCard, DollarSign, Package } from "lucide-react";
import { getTotalSales } from "@/actions/get-total-sales";
import { getTotalProductsInStock } from "../../../../actions/get-total-productsInStock";
import Overview from "@/components/ui/Overview";
import { getRevenueGraph } from "@/actions/get-graph-revenue";

const StorePage = async ({ params }: { params: { storeId: string } }) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const totalSales = await getTotalSales(params.storeId);
  const productsInStock = await getTotalProductsInStock(params.storeId);
  const graphRevenue = await getRevenueGraph(params.storeId);
  return (
    <div className="flex flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          className="h-fit"
          title="Dashboard"
          description="Overview of your store"
        />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="capitalize  flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                total revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="capitalize  flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalSales}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="capitalize  flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Products in stock
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productsInStock}</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>Overview</CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StorePage;
