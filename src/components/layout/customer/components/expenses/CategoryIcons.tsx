import React from 'react';
import ReactOdometer from 'react-odometerjs';
import { getCategoryIcon } from '@/utils/helpers/getCategoryIcon';

const CategoryIcons: React.FC<{
  writeOffSummary: Array<{ category: string; totalItemByCategory: number }>;
}> = ({ writeOffSummary }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {writeOffSummary?.map(({ category, totalItemByCategory }, index) => {
        return (
          <div
            key={index}
            className="flex items-center gap-1 text-xs text-gray-600"
          >
            <div className="bg-gray-100 rounded-md flex gap-1.5 p-1.5">
              {React.createElement(getCategoryIcon(category), { size: 16 })}{' '}
              <span className="text-gray-500">
                <ReactOdometer
                  value={totalItemByCategory}
                  format="( ddd),dd"
                  duration={500}
                  theme="minimal"
                />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryIcons;
