'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CircularProgressChart from './CircularProgressChart';
import { trpc } from '@/utils/trpc';
import { percentageCalculatorForDeductibleExpenses } from '@/utils/helpers/percentageCalculatorForDeductibleExpenses';

const DeductiveExpenses = () => {
  const { data: expenses } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery({
      expense_type: 'business',
    });

  const totalAmount = expenses?.data?.categoryWiseExpenses
    ?.reduce(
      (sum: number, expense: { amount: number }) => sum + expense.amount,
      0
    )
    .toFixed(2);

  const { topCategory, utilities } = percentageCalculatorForDeductibleExpenses(
    expenses?.data?.categoryWiseExpenses
  );
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
          <p className="text-[32px] text-[#00104B] font-bold">
            NOK {totalAmount}
          </p>
        </div>

        <div className="mt-4 space-y-2 ">
          <div className="flex justify-between items-center px-4 bg-[#F0EFFE] py-2 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-sm text-[#101010] font-semibold">
                {topCategory?.name}
              </span>
              <span className="text-sm text-[#627A97] font-medium">
                Top savings from
              </span>
            </div>
            <CircularProgressChart series={[topCategory?.percentage]} />
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
              series={[utilities.percentage]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeductiveExpenses;
