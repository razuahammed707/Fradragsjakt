'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CircularProgressChart from './CircularProgressChart';

const DeductiveExpenses = () => {
  return (
    <Card className="col-span-6 py-6 px-[21px] border border-[#EEF0F4] shadow-none rounded-2xl">
      <CardContent className="p-0 relative">
        <Badge className="bg-[#F0EFFE] px-1 absolute top-0 right-0  hover:text-white rounded-[5px] text-xs text-[#627A97] font-medium">
          This year
        </Badge>
        <div className=" ">
          <h4 className="text-sm  text-[#627A97] font-semibold">
            All Deductible Expenses
          </h4>
          <p className="text-[32px] text-[#00104B] font-bold">NOK 30,000</p>
        </div>

        <div className="mt-4 space-y-2 ">
          <div className="flex justify-between items-center px-4 bg-[#F0EFFE] py-2 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-sm text-[#101010] font-semibold">
                Travel
              </span>
              <span className="text-sm text-[#627A97] font-medium">
                Top savings from
              </span>
            </div>
            <CircularProgressChart />
          </div>
          <div className="flex justify-between items-center px-4 bg-[#F0EFFE] py-2 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-sm text-[#101010] font-semibold">
                Utilities
              </span>
              <span className="text-sm text-[#627A97] font-medium">
                Top savings from
              </span>
            </div>
            <CircularProgressChart
              color="#F99BAB"
              trackBg="#F99BAB5E"
              series={[55]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeductiveExpenses;
