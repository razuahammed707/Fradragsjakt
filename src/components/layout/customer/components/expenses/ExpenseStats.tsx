'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const ExpenseStats: React.FC<{ title: string }> = ({ title }) => {
  const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const chartOptions = {
    series: [
      {
        name: 'Transactions',
        data: [2300, 3100, 4000, 5000, 3600, 3200, 2300],
      },
    ] as ApexAxisChartSeries,
    options: {
      chart: {
        type: 'bar',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        animations: {
          enabled: true,
          speed: 200,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '60%',
          borderRadius: 2,
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: weekDays,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
        crosshairs: {
          show: false,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      grid: {
        show: false,
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        y: {
          formatter: function (value: number) {
            return `$${value.toLocaleString()}`;
          },
        },
        custom: function ({
          series,
          seriesIndex,
          dataPointIndex,
          w,
        }: {
          series: number[][];
          seriesIndex: number;
          dataPointIndex: number;
          w: unknown;
        }) {
          const value = series[seriesIndex][dataPointIndex];
          const day = w.globals.labels[dataPointIndex];

          return `<div class="custom-tooltip shadow-md" style="padding: 8px;">
            <h1 style="color: #fff">${day}</h1>
            <span style="color: #fff">NOK ${value.toLocaleString()}</span>
          </div>`;
        },
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.9,
          },
        },
      },
      title: {
        text: undefined,
      },
      colors: title === 'Business' ? ['#00B386'] : ['#F99BAB'],
    },
  } as { series: ApexAxisChartSeries; options: ApexOptions };

  return (
    <ReactApexChart
      options={chartOptions.options}
      series={chartOptions.series}
      type="bar"
      height={60}
      width={120}
    />
  );
};

export default ExpenseStats;
