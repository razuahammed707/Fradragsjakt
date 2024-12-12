'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const IncomeSummaryChart = ({
  incomes,
}: {
  incomes: { amount: number; category: string }[];
}) => {
  // Predefined color palette (you can adjust as needed)
  const colorPalette = [
    '#9F97F7',
    '#FFB44F',
    '#F99BAB',
    '#9BDFC4',
    '#62B2FD',
    '#6EC1E4',
  ];

  // Calculate total amount
  const totalAmount = incomes?.reduce(
    (sum: number, income: { amount: number }) => sum + income.amount,
    0
  );

  // Prepare chart series and labels
  const chartSeries =
    incomes?.map((income: { amount: number }) => income.amount) || [];
  const chartLabels =
    incomes?.map((income: { category: string }) => income.category) || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartOptions: any = {
    chart: {
      type: 'donut' as const,
    },
    labels: chartLabels,
    colors: colorPalette.slice(0, incomes?.length),
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      dropShadow: {
        enabled: false,
      },
    },
    legend: {
      show: false, // Hide legend
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
              fontWeight: 600,
              color: '#1F2937',
              offsetY: 5,
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 600,
              color: '#000',
              formatter: (val: number) => `NOK ${val?.toLocaleString()}`,
            },
            total: {
              show: true,
              label: false,
              fontSize: '24px',
              fontWeight: 600,
              color: '#1F2937',
              formatter: () => `NOK ${totalAmount?.toLocaleString()}`,
            },
          },
        },
      },
      expandOnClick: false,
    },
    stroke: {
      width: 0,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `NOK ${val.toLocaleString()}`,
      },
    },
  };

  return (
    <div className="col-span-6 space-y-6 p-6 bg-white rounded-2xl border border-[#EEF0F4] shadow-none mt-2">
      <div className="flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold text-[#71717A]">Summary</h3>
            <p className="text-[#71717A] text-xs">Incomes Breakdown</p>
          </div>
        </div>
        <div className="flex justify-center">
          <Chart
            options={chartOptions}
            height={300}
            width={300}
            series={chartSeries}
            type="donut"
          />
        </div>
      </div>
    </div>
  );
};

export default IncomeSummaryChart;
