'use client';
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Control, Controller } from 'react-hook-form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Eye, EyeOff } from 'lucide-react';
import { numberFormatter } from '@/utils/helpers/numberFormatter';
import { sanitizeNumberInput } from '@/utils/helpers/sanitizeNumberInput';

type Option = {
  title: string;
  value: string;
};

export interface FormInputProps {
  name: string;
  type?: 'text' | 'email' | 'password' | 'select' | 'number' | 'textarea';
  placeholder?: string;
  options?: Option[];
  control?: Control<any>;
  required?: boolean;
  customClassName?: string;
  defaultValue?: string | number;
  rows?: number;
  errorMessage?: string;
  showPasswordRequirements?: boolean;
  disabled?: boolean;
  maxValue?: boolean;
  noFraction?: boolean;
  id?: string; // Add id prop
}

export function FormInput({
  name,
  placeholder,
  type = 'text',
  options = [],
  control,
  required,
  customClassName,
  defaultValue = '',
  rows,
  errorMessage,
  showPasswordRequirements,
  disabled,
  maxValue,
  noFraction,
  id = name, // Default to `name` if no `id` is provided
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Select input
  if (type === 'select') {
    return (
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        defaultValue={defaultValue}
        render={({ field }) => (
          <div>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                id={id}
                className={`w-full data-[placeholder]:text-muted-foreground ${customClassName}`}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent
                className="max-h-[300px] overflow-y-auto"
                position="popper" // Add this to control positioning
                side="top" // Open dropdown above the field if there's no space below
              >
                <SelectGroup>
                  {options?.map((option, i) => (
                    <SelectItem key={i} value={option.value}>
                      {option.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
          </div>
        )}
      />
    );
  }
  // Textarea input
  if (type === 'textarea') {
    return (
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        defaultValue={defaultValue}
        render={({ field }) => (
          <div>
            <Textarea
              {...field}
              id={id} // Add id
              placeholder={placeholder}
              rows={rows}
              className={`w-full resize-y max-h-[200px] overflow-y-auto ${customClassName}`}
              required={required}
              disabled={disabled}
            />
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
          </div>
        )}
      />
    );
  }

  // Number input
  if (type === 'number') {
    return (
      <Controller
        name={name}
        control={control}
        rules={{
          required,
          validate: (value) => {
            const numericValue = sanitizeNumberInput(value);

            if (noFraction && !Number.isInteger(numericValue)) {
              return 'Value must be a whole number';
            }

            if (maxValue && numericValue > 100) {
              return `Value cannot exceed 100`;
            }

            return true;
          },
        }}
        defaultValue={defaultValue}
        render={({ field, fieldState: { error } }) => (
          <div>
            <Input
              {...field}
              id={id} // Add id
              type="text"
              value={numberFormatter(field.value)}
              placeholder={placeholder}
              className={`w-full p-2 border border-gray-300 text-sm placeholder:text-muted-foreground rounded-md ${customClassName}`}
              required={required}
              disabled={disabled}
            />

            {(error || maxValue || noFraction) && (
              <div
                className={`text-sm mt-1 ${
                  error ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {error?.message ||
                  (noFraction &&
                    maxValue &&
                    'Value must be a whole number & can not exceed 100') ||
                  (noFraction && 'Value must be a whole number') ||
                  (maxValue && `Value cannot exceed 100`)}
              </div>
            )}
          </div>
        )}
      />
    );
  }

  // Password input
  if (type === 'password') {
    return (
      <Controller
        name={name}
        control={control}
        rules={{
          required,
          ...(showPasswordRequirements && {
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long.',
            },
          }),
        }}
        defaultValue={defaultValue}
        render={({ field, fieldState: { error } }) => (
          <div>
            <div className={`relative w-full ${customClassName}`}>
              <Input
                {...field}
                id={id} // Add id
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                className="w-full p-2 border border-gray-300 text-sm placeholder:text-muted-foreground rounded-md"
                required={required}
                disabled={disabled}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                disabled={disabled}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {showPasswordRequirements && (
              <div
                className={`text-sm mt-1 ${
                  error ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {error?.message ||
                  'Password must be at least 6 characters long.'}
              </div>
            )}
          </div>
        )}
      />
    );
  }

  // Default input (text, email, etc.)
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required,
        ...(maxValue && {
          maxValue: {
            value: maxValue,
            message: `Value cannot exceed ${maxValue} digits.`,
          },
        }),
      }}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Input
            {...field}
            id={id} // Add id
            type={type}
            placeholder={placeholder}
            className={`w-full p-2 border border-gray-300 text-sm placeholder:text-muted-foreground rounded-md ${customClassName}`}
            required={required}
            disabled={disabled}
          />
          {maxValue && (
            <div
              className={`text-sm mt-1 ${
                error ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              {error?.message || `Value cannot exceed ${maxValue} digits.`}
            </div>
          )}
        </div>
      )}
    />
  );
}
