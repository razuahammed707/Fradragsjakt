'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';
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
import { useState, useEffect } from 'react';

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
  required?: boolean;
  searchEnabled?: boolean;
}

export function SelectFormInput({
  name,
  options = defaultOptions,
  placeholder = 'Select an option...',
  control,
  customClassName,
  errorMessage,
  defaultValue = '',
  required = false,
  searchEnabled = false,
}: SelectFormInputProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const findScrollableElement = () => {
      const commandLists = document.querySelectorAll('[cmdk-list]');
      if (commandLists.length === 0) return null;

      const mostRecentList = commandLists[commandLists.length - 1];

      const scrollableDivs = mostRecentList.querySelectorAll('div');
      for (const div of Array.from(scrollableDivs)) {
        const styles = window.getComputedStyle(div);
        if (styles.overflowY === 'auto' || styles.overflowY === 'scroll') {
          return div;
        }
      }

      return mostRecentList;
    };

    setTimeout(() => {
      const scrollableElement = findScrollableElement();
      if (!scrollableElement) return;

      const handleWheel = (e: WheelEvent) => {
        const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight;

        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
          return;
        }

        e.stopPropagation();
        scrollableElement.scrollTop += e.deltaY;
      };

      scrollableElement.addEventListener(
        'wheel',
        handleWheel as EventListener,
        { passive: true }
      );

      return () => {
        scrollableElement.removeEventListener(
          'wheel',
          handleWheel as EventListener
        );
      };
    }, 100);
  }, [open]);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{ required: required }}
      render={({ field: { value, onChange } }) => (
        <div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  'w-full justify-between relative pr-12 ps-3',
                  customClassName
                )}
              >
                <span className="truncate text-black font-normal">
                  {value ? (
                    options.find((option) => option.value === value)?.title
                  ) : (
                    <span className="text-muted-foreground">{placeholder}</span>
                  )}
                </span>
                {value && (
                  <X
                    className="absolute rounded-full bg-gray-400 right-8 h-3 w-3 shrink-0 opacity-50 hover:opacity-100 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange('');
                    }}
                  />
                )}
                <ChevronsUpDown className="absolute right-4 h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                {searchEnabled && (
                  <CommandInput
                    placeholder="Search options..."
                    className="h-9"
                  />
                )}
                <CommandList className="max-h-[200px] overflow-y-auto">
                  <CommandEmpty>No options found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={(currentValue) => {
                          onChange(currentValue);
                          setOpen(false);
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
