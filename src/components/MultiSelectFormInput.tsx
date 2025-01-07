'use client';

import React, { useState, useRef } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Controller, Control } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const defaultOptions = [
  { label: 'Married', value: 'married' },
  { label: 'Dependents', value: 'dependents' },
  { label: 'Freelancer', value: 'freelancer' },
  { label: 'Employee', value: 'employee' },
  { label: 'Business Owner', value: 'business owner' },
  { label: 'Student', value: 'student' },
  { label: 'Sole Proprietorship', value: 'sole proprietorship' },
];
type Option = {
  value: string;
  label: string;
};

export interface MultiSelectFormInputProps {
  name: string;
  options?: Option[];
  placeholder?: string;
  control: Control<any>;
  customClassName?: string;
  errorMessage?: string;
  defaultValue?: string[];
}

export function MultiSelectFormInput({
  name,
  options = defaultOptions,
  placeholder = 'Select options...',
  control,
  customClassName,
  errorMessage,
  defaultValue = [],
}: MultiSelectFormInputProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLButtonElement>(null);

  const handleToggleValue = (selectedValues: string[], val: string) => {
    return selectedValues.includes(val)
      ? selectedValues.filter((item) => item !== val)
      : [...selectedValues, val];
  };

  const handleRemoveValue = (selectedValues: string[], val: string) => {
    return selectedValues.filter((item) => item !== val);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { value = [], onChange } }) => (
        <div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                ref={inputRef}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={`w-full px-2 justify-between ${customClassName}`}
              >
                <div className="flex gap-2 justify-start flex-wrap">
                  {value.length > 0 ? (
                    <>
                      {value.slice(0, 2).map((val: string) => (
                        <span
                          key={val}
                          className="px-1 flex items-center gap-1 rounded-md border bg-slate-200 text-[10px] font-medium"
                        >
                          {
                            options.find((option) => option.value === val)
                              ?.label
                          }
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onChange(handleRemoveValue(value, val));
                            }}
                          >
                            <X className="h-2 w-2 text-red-500" />
                          </button>
                        </span>
                      ))}
                      {value.length > 2 && (
                        <span className="px-1 rounded-md border bg-slate-200 text-[10px] font-medium">
                          +{value.length - 2} more...
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-muted-foreground font-medium">
                      {placeholder}
                    </span>
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command className="w-full">
                <CommandInput placeholder="Search options..." />
                <CommandEmpty>No options found.</CommandEmpty>
                <CommandList className="max-h-[150px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() =>
                          onChange(handleToggleValue(value, option.value))
                        }
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value.includes(option.value)
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              {value.length > 0 && (
                <div className="p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChange([])}
                    className="w-full text-xs"
                  >
                    Reset
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          {errorMessage && (
            <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
          )}
        </div>
      )}
    />
  );
}
