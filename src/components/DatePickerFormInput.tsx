'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Control, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';

interface DatePickerFormInputProps {
  name: string;
  label: string;
  control: Control<any>;
  defaultValue?: Date;
  description?: string;
  placeholder?: string;
  required?: boolean;
  customClassName?: string;
  disabled?: boolean;
}

export function DatePickerFormInput({
  name,
  label,
  control,
  defaultValue,
  description,
  placeholder = 'MM/DD/YYYY',
  required = false,
  customClassName = '',
  disabled = false,
}: DatePickerFormInputProps) {
  return (
    <div className={customClassName}>
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => (
          <div className="mt-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  id={name}
                  className={cn(
                    'w-full px-2 text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                  disabled={disabled}
                >
                  {field.value ? (
                    format(field.value, 'MM/dd/yyyy')
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 pointer-events-auto"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    disabled ||
                    date > new Date() ||
                    date < new Date('1900-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </div>
        )}
      />
    </div>
  );
}
