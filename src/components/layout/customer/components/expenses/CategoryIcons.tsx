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
          <div key={index} className="flex items-center gap-1 text-xs">
            <div
              className="bg-white/80 group-hover:bg-white rounded-lg flex gap-2 p-2.5 
              transition-all duration-200 hover:scale-105 border border-gray-100
              group-hover:border-primary/20 group-hover:shadow-sm relative"
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/80 group-hover:to-primary/5 
                transition-colors duration-300 rounded-lg"
              />
              <div className="relative flex items-center gap-2">
                {React.createElement(getCategoryIcon(category), {
                  size: 16,
                  className:
                    'text-gray-500 group-hover:text-primary transition-colors duration-200',
                })}
                <span className="text-gray-600 group-hover:text-primary/80 font-medium">
                  <ReactOdometer
                    value={totalItemByCategory}
                    format="( ddd),dd"
                    duration={500}
                    theme="minimal"
                  />
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryIcons;
