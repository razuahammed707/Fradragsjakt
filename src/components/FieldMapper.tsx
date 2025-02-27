import React from 'react';
import { Control } from 'react-hook-form';
import { Column, FormData } from '@/types/upload-statements';
import { SelectFormInput } from './SelectFormInput';

interface FieldMapperProps {
  control: Control<FormData, any>;
  headers: Column[];
  targetColumns: Column[];
  findBestMatch: (columnTitle: string, headers: Column[]) => string | undefined;
}

export const FieldMapper: React.FC<FieldMapperProps> = ({
  control,
  headers,
  targetColumns,
  findBestMatch,
}) => {
  const headerOptions = React.useMemo(
    () =>
      headers.map((header) => ({
        value: header.title,
        title: header.title,
      })),
    [headers]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <p className="text-gray-400 border-b border-gray-200 text-xs pb-2">
          Required Field
        </p>
        <p className="text-gray-400 border-b border-gray-200 text-xs pb-2">
          File Column Headers
        </p>
      </div>

      {targetColumns.map((column, i) => (
        <div key={i} className="grid grid-cols-2 gap-4 space-y-2 items-center">
          <p className="text-gray-800 text-xs pt-2 font-semibold">
            {column.title}
          </p>
          <SelectFormInput
            name={column.title}
            control={control}
            placeholder={column.title}
            options={headerOptions}
            required={column.title === 'Date' ? false : true}
            defaultValue={findBestMatch(column.title, headers)}
          />
        </div>
      ))}
    </div>
  );
};
