import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Control, Controller } from 'react-hook-form';

type Option = {
  title: string;
  value: string;
};

export interface FormInputProps {
  name: string;
  type: 'text' | 'email' | 'password' | 'select' | 'number';
  placeholder?: string;
  options?: Option[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>;
  required?: boolean;
  customClassName?: string;
  defaultValue?: string;
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
}: FormInputProps) {
  if (type === 'select') {
    return (
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className={`w-full ${customClassName}`}>
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
        )}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      defaultValue={defaultValue}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          placeholder={placeholder}
          className={`w-full p-2 border border-gray-300 text-sm placeholder:text-muted-foreground rounded-md ${customClassName}`}
          required={required}
        />
      )}
    />
  );
}
