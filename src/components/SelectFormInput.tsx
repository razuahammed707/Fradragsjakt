'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { Controller, Control } from 'react-hook-form';
import { cn } from '@/lib/utils';
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
import { useState } from 'react';

const defaultOptions = [
  { title: 'Married', value: 'married' },
  { title: 'Dependents', value: 'dependents' },
  { title: 'Freelancer', value: 'freelancer' },
  { title: 'Employee', value: 'employee' },
  { title: 'Business Owner', value: 'business owner' },
  { title: 'Student', value: 'student' },
  { title: 'Sole Proprietorship', value: 'sole proprietorship' },
];

type Option = {
  value: string;
  title: string;
};

interface SelectFormInputProps {
  name: string;
  options?: Option[];
  placeholder?: string;
  control: Control<any>;
  customClassName?: string;
  errorMessage?: string;
  defaultValue?: string;
}

export function SelectFormInput({
  name,
  options = defaultOptions,
  placeholder = 'Select an option...',
  control,
  customClassName,
  errorMessage,
  defaultValue = '',
}: SelectFormInputProps) {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { value, onChange } }) => (
        <div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn('w-full justify-between', customClassName)}
              >
                {value ? (
                  options.find((option) => option.value === value)?.title
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search options..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No options found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={(currentValue) => {
                          onChange(currentValue);
                          setOpen(false); // Close the popover only after selecting an option
                        }}
                      >
                        {option.title}
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            value === option.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
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
