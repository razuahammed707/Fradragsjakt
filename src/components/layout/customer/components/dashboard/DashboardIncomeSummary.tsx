'use client';

import React from 'react';
import DashboardTotalIncomeChart from './DashboardTotalIncomeChart';
import { trpc } from '@/utils/trpc';
import IncomeSummaryChart from './IncomeSummaryChart';
import YearlyIncomeGraph from './YearlyIncomeGraph';

function DashboardIncomeSummary() {
  const { data: incomeAnalytics } =
    trpc.incomes.getCategoryAndIncomeTypeWiseIncomes.useQuery({
      income_type: '',
    });

  console.log('income analytics', incomeAnalytics);
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-6">
        <div className="grid grid-cols-12 gap-2">
          <DashboardTotalIncomeChart incomeAnalytics={incomeAnalytics} />
          <IncomeSummaryChart
            incomes={incomeAnalytics?.data?.categoryWiseIncomes}
          />
        </div>
      </div>
      <div className="col-span-6 mt-2 h-full">
        <YearlyIncomeGraph />
      </div>
    </div>
  );
}

export default DashboardIncomeSummary;
