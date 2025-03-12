import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface PercentageSliderInputProps {
  name: string;
  control: Control<any>;
  defaultValue?: number;
  label?: string;
  customClassName?: string;
  onThresholdChange?: (value: number) => void;
}

export function PercentageSliderInput({
  name,
  control,
  defaultValue = 50,
  customClassName = '',
  onThresholdChange,
}: PercentageSliderInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { value, onChange } }) => (
        <div className={`flex items-center gap-4 ${customClassName}`}>
          <div className="relative w-20">
            <Input
              type="text"
              value={value || ''}
              onChange={(e) => {
                const newValue = parseInt(e.target.value);
                if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                  onChange(newValue);
                  onThresholdChange?.(newValue);
                }
              }}
              className="px-5"
              min={0}
              max={100}
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>
          <Slider
            value={[value || 0]}
            onValueChange={(vals) => {
              onChange(vals[0]);
              onThresholdChange?.(vals[0]);
            }}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>
      )}
    />
  );
}
