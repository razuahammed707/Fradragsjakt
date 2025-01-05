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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>;
  required?: boolean;
  customClassName?: string;
  defaultValue?: string | number;
  rows?: number;
  errorMessage?: string; // Add an optional error message prop
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
  errorMessage, // Receive the errorMessage as prop
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
            <Select value={field.value} onValueChange={field.onChange}>
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
            )}{' '}
            {/* Display error globally */}
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
            />
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}{' '}
            {/* Display error globally */}
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
            />
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}{' '}
            {/* Display error globally */}
          </div>
        )}
      />
    );
  }

  if (type === 'password') {
    return (
      <Controller
        name={name}
        control={control}
        rules={{
          required,
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters long.',
          },
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <div className="text-red-500 text-sm mt-1">{error.message}</div>
            )}{' '}
            {/* Display error globally */}
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
          />
          {error && (
            <div className="text-red-500 text-sm mt-1">{error.message}</div>
          )}{' '}
          {/* Display error globally */}
        </div>
      )}
    />
  );
}
