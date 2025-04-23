'use client';

import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SearchInput({
  className,
  placeholder = 'e.g. Netflix',
  onChange,
  iconPosition = 'left',
  iconClassName,
}: {
  className?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconPosition?: 'left' | 'right' | 'none';
  iconSize?: number;
  iconClassName?: string;
}) {
  const form = useForm({
    defaultValues: {
      search: '',
    },
  });

  const getInputPadding = () => {
    if (iconPosition === 'left') return 'pl-12';
    if (iconPosition === 'right') return 'pr-8';
    return '';
  };

  const getIconPositionStyles = () => {
    if (iconPosition === 'left') return 'left-3 top-2.5';
    if (iconPosition === 'right') return 'right-3 top-2.5';
    return '';
  };

  return (
    <form className="w-full">
      <div className="relative">
        <Input
          type="search"
          placeholder={placeholder}
          className={cn(
            'w-[332px] appearance-none bg-background py-2 shadow-none placeholder:text-[#71717A] placeholder:text-sm',
            'focus-visible:ring-2 focus-visible:ring-[#5B52F9]  focus-visible:ring-inset',
            getInputPadding(),
            className
          )}
          {...form.register('search')}
          onChange={(e) => {
            form.setValue('search', e.target.value);
            if (onChange) {
              onChange(e);
            }
          }}
        />

        {iconPosition !== 'none' && (
          <Search
            className={cn(
              `absolute ${getIconPositionStyles()} h-4 w-4 text-[#71717A]`,
              iconClassName
            )}
          />
        )}
      </div>
    </form>
  );
}
