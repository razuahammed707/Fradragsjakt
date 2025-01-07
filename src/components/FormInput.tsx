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

type Option = {
  title: string;
  value: string;
};

export interface FormInputProps {
  name: string;
  type: 'text' | 'email' | 'password' | 'select' | 'number' | 'textarea';
  placeholder?: string;
  options?: Option[];
  control?: Control<any>;
  required?: boolean;
  customClassName?: string;
  defaultValue?: string | number;
  rows?: number;
  errorMessage?: string;
  showPasswordRequirements?: boolean;
  disabled?: boolean; // New prop to disable the input
}

export function FormInput({
  name,
  placeholder,
  type = 'text',
  options = [],
  control,
  required = false,
  customClassName,
  defaultValue = '',
  rows,
  errorMessage,
  showPasswordRequirements = true,
  disabled = false, // Default value for disabled
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
              disabled={disabled} // Apply disabled prop
            >
              <SelectTrigger
                className={`w-full data-[placeholder]:text-muted-foreground ${customClassName}`}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.map((option, i) => (
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
              placeholder={placeholder}
              rows={rows}
              className={`w-full resize-y ${customClassName}`}
              required={required}
              disabled={disabled} // Apply disabled prop
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
        rules={{ required }}
        defaultValue={numberFormatter(defaultValue as number)}
        render={({ field }) => (
          <div>
            <Input
              {...field}
              type="text"
              value={numberFormatter(field.value as number)}
              placeholder={placeholder}
              className={`w-full p-2 border border-gray-300 text-sm placeholder:text-muted-foreground rounded-md ${customClassName}`}
              required={required}
              disabled={disabled} // Apply disabled prop
            />
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
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
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                className="w-full p-2 border border-gray-300 text-sm placeholder:text-muted-foreground rounded-md"
                required={required}
                disabled={disabled} // Apply disabled prop
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                disabled={disabled} // Disable button if input is disabled
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

  // Default input
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            className={`w-full p-2 border border-gray-300 text-sm placeholder:text-muted-foreground rounded-md ${customClassName}`}
            required={required}
            disabled={disabled} // Apply disabled prop
          />
          {error && (
            <div className="text-red-500 text-sm mt-1">{error.message}</div>
          )}
        </div>
      )}
    />
  );
}
