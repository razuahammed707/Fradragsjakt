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
import { Badge } from '@/components/ui/badge';

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
  useBadgeLayout?: boolean;
  onRemoveItem?: (value: string) => void;
}

export function MultiSelectFormInput({
  name,
  options = defaultOptions,
  placeholder = 'Select options...',
  control,
  customClassName,
  errorMessage,
  defaultValue = [],
  useBadgeLayout = false,
  onRemoveItem,
}: MultiSelectFormInputProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLButtonElement>(null);

  const handleToggleValue = (selectedValues: string[], val: string) => {
    return selectedValues.includes(val)
      ? selectedValues.filter((item) => item !== val)
      : [...selectedValues, val];
  };

  const handleRemoveValue = (selectedValues: string[], val: string) => {
    if (onRemoveItem) {
      onRemoveItem(val);
    }
    return selectedValues.filter((item) => item !== val);
  };

  const renderBadgeLayout = (
    value: string[],
    onChange: (value: string[]) => void
  ) => {
    if (value.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-4 transition-all duration-300 ease-in-out">
        {value.map((val) => (
          <Badge
            key={val}
            variant="secondary"
            className="inline-flex items-center bg-[#F0EFFE] rounded-md px-3 py-1.5 transition-all duration-300 ease-in-out hover:bg-[#E0DFFE]"
          >
            <span className="text-sm text-[#0F172A]">
              {options.find((option) => option.value === val)?.label}
            </span>
            <button
              type="button"
              className="ml-2 text-[#94A3B8] hover:text-[#475569] transition-colors duration-200"
              onClick={() => onChange(handleRemoveValue(value, val))}
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { value = [], onChange } }) => (
        <div className="transition-all duration-300 ease-in-out">
          {useBadgeLayout && renderBadgeLayout(value, onChange)}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                ref={inputRef}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={`w-full px-2  justify-between transition-all duration-300 ease-in-out ${customClassName}`}
              >
                <div className="flex gap-2 justify-start flex-wrap transition-all duration-300 ease-in-out">
                  {/* Only show the internal representation when not using badge layout */}
                  {!useBadgeLayout && value.length > 0 ? (
                    <>
                      {value.slice(0, 2).map((val: string) => (
                        <span
                          key={val}
                          className="px-1 flex items-center gap-1 rounded-md border bg-slate-200 text-[10px] font-medium transition-all duration-300 ease-in-out hover:bg-slate-300"
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
                            <X className="h-2 w-2 text-red-500 transition-colors duration-200 hover:text-red-600" />
                          </button>
                        </span>
                      ))}
                      {value.length > 2 && (
                        <span className="px-1 rounded-md border bg-slate-200 text-[10px] font-medium transition-all duration-300 ease-in-out hover:bg-slate-300">
                          +{value.length - 2} more...
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-muted-foreground font-medium transition-colors duration-200">
                      {value.length > 0 && useBadgeLayout
                        ? `${value.length} selected`
                        : placeholder}
                    </span>
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50 transition-transform duration-200" />
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
