// FilterSelectField.tsx
import React from 'react';
import SelectField from './ExpenseSelectField';

// Define the type for props
interface FilterSelectFieldProps {
  label: string;
  placeholder: string;
  items: { value: string; label: string }[]; // Define the shape of items
}

const FilterSelectField: React.FC<FilterSelectFieldProps> = ({
  label,
  placeholder,
  items,
}) => {
  return (
    <div className="flex items-center mb-4 w-full justify-between">
      <label className="text-gray-800 text-xs font-semibold w-1/3 text-left">
        {label}
      </label>
      <div className="w-2/3 max-w-[225px]">
        <SelectField placeholder={placeholder} items={items} label={''} />
      </div>
    </div>
  );
};

export default FilterSelectField;
