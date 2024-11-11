// components/SummaryChart.tsx
'use client';
import dynamic from 'next/dynamic';
import React from 'react';
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});
const SummaryChart: React.FC = () => {
  const chartOptions = {
    chart: {
      type: 'donut' as const,
    },
    colors: ['#9F97F7', '#FFB44F', '#F99BAB', '#9BDFC4', '#62B2FD', '#6EC1E4'],
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
              show: false,
            },
            total: {
              show: true,
              label: 'NOK 41,000',
              fontSize: '22px',
              fontWeight: 600,
              color: '#1F2937',
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
        formatter: (val: number) => `$${val.toLocaleString()}`,
      },
    },
  };

  const chartSeries = [5, 10, 15, 25, 25, 25];

  return (
    <div className="col-span-6 space-y-6 p-6 bg-white rounded-2xl  border border-[#EEF0F4] shadow-none">
      <div className="flex flex-col h-full justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#71717A]">Summary</h3>
          <p className="text-[#71717A] text-xs ">Please check your docs</p>
        </div>
        <div className="flex justify-center">
          <Chart
            options={chartOptions}
            height={208}
            width={208}
            series={chartSeries}
            type="donut"
          />
        </div>
      </div>
    </div>
  );
};

export default SummaryChart;
