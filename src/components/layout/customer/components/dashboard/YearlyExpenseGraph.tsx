import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ApexOptions } from 'apexcharts';
import { Handshake, SquareUserRound } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/TranslationProvider';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const YearlyExpenseGraph = () => {
  const [showPersonal, setShowPersonal] = useState(true);
  const { translate } = useTranslation();

  const getOptions = (isPersonal: boolean): ApexOptions => ({
    chart: { toolbar: { show: false }, animations: { enabled: true } },
    stroke: {
      curve: 'smooth',
      colors: isPersonal ? ['#FFAFA3'] : ['#7549FF'], // Personal vs Business Stroke Color
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: isPersonal
        ? {
            type: 'vertical',
            gradientToColors: ['rgba(241, 237, 255, 0)'], // Transparent end
            shadeIntensity: 0,
            stops: [0, 100],
            colorStops: [
              { offset: 0, color: '#F3F0FF', opacity: 1 },
              { offset: 100, color: 'rgba(241, 237, 255, 0)', opacity: 0 },
            ],
          }
        : {
            type: 'vertical', // Matches 180deg
            gradientToColors: ['rgba(241, 237, 255, 0)'], // Transparent end
            shadeIntensity: 0,
            stops: [0, 100], // Equivalent to -13.53% to 98.07% in CSS (stretched to full range)
            colorStops: [
              { offset: 0, color: '#F3F0FF', opacity: 1 },
              { offset: 100, color: 'rgba(241, 237, 255, 0)', opacity: 0 },
            ],
          },
    },
    dataLabels: { enabled: false }, // Removes the number labels on the stroke
    grid: { show: false },

    xaxis: {
      categories: [
        'July',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
      ],
      tickPlacement: 'on',
      axisTicks: { show: true },
      axisBorder: { show: true, color: '#EEF0F4' },
      labels: { style: { fontSize: '8.447px', colors: '#71717A' } },
    },

    yaxis: {
      min: 0,
      max: 50,
      tickAmount: 5,
      axisTicks: { show: true },
      axisBorder: { show: true, color: '#EEF0F4' },
      labels: {
        formatter: (val: number) => `NOK ${val}k`,
        style: { fontSize: '8.447px', colors: '#71717A' },
      },
    },
  });

  const personalSeries = [
    {
      name: 'Personal Expense',
      data: [10, 20, 15, 25, 22, 20, 30, 35, 25, 28, 22, 20],
    },
  ];

  const businessSeries = [
    {
      name: 'Business Expense',
      data: [15, 10, 20, 18, 35, 25, 30, 40, 42, 35, 40, 35],
    },
  ];

  return (
    <Card className="col-span-7 border border-[#EEF0F4] flex flex-col justify-between shadow-none pt-4 px-4 rounded-2xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg text-[#101010] font-semibold">
            {translate('page.dashboard.title')}
          </h2>
          <p className="text-xs text-[#71717A]">
            {translate('page.dashboard.subTitle')}
          </p>
        </div>
        <div className="flex">
          <button
            onClick={() => setShowPersonal(true)}
            className={`w-[63px] h-[36px] flex justify-center items-center rounded ${
              showPersonal ? 'bg-indigo-500 text-white' : 'bg-gray-100'
            }`}
          >
            <SquareUserRound
              className={`${showPersonal ? 'text-white' : 'text-[#5B52F9]'}`}
            />
          </button>
          <button
            onClick={() => setShowPersonal(false)}
            className={`w-[63px] h-[36px] flex justify-center items-center rounded ${
              !showPersonal ? 'bg-indigo-500 text-white' : 'bg-gray-100'
            }`}
          >
            <Handshake
              className={`${!showPersonal ? 'text-white' : 'text-[#5B52F9]'}`}
            />
          </button>
        </div>
      </div>

      <ApexChart
        key={showPersonal ? 'personal' : 'business'}
        options={getOptions(showPersonal)}
        series={showPersonal ? personalSeries : businessSeries}
        type="area"
        height={231}
      />
    </Card>
  );
};

export default YearlyExpenseGraph;
