import { Controller, useWatch } from 'react-hook-form';
import { Info } from 'lucide-react';

interface YesNoInputProps {
  control: any;
  name: string;
  yesText?: string;
  helpText?: string;
  hasHelpLink?: boolean;
  customClassName?: string;
  onChange?: (value: boolean) => void;
}

export const YesNoInput = ({
  control,
  name,
  yesText = 'Yes',
  helpText,
  hasHelpLink,
  customClassName = '',
  onChange: externalOnChange,
}: YesNoInputProps) => {
  const fieldValue = useWatch({
    control,
    name,
    defaultValue: false,
    exact: true,
  });

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      rules={{ required: true }}
      shouldUnregister={false}
      render={({ field: { onChange } }) => {
        const handleValueChange = (newValue: boolean) => {
          if (fieldValue !== newValue) {
            onChange(newValue);
            if (externalOnChange) {
              externalOnChange(newValue);
            }
          }
        };

        return (
          <div className={`w-full ${customClassName}`}>
            <div className="flex flex-col gap-2">
              <div
                role="button"
                tabIndex={0}
                className={`w-full p-3 text-left border-2 rounded-lg hover:border-[#5B52F9] transition-all ${
                  fieldValue === true
                    ? 'border-[#5B52F9] bg-[#F0EFFE]'
                    : 'border-[#EEF0F4]'
                }`}
                onClick={() => handleValueChange(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleValueChange(true);
                  }
                }}
              >
                <span>{yesText}</span>
              </div>
              <div
                role="button"
                tabIndex={0}
                className={`w-full p-3 text-left border-2 rounded-lg hover:border-[#5B52F9] transition-all ${
                  fieldValue === false
                    ? 'border-[#5B52F9] bg-[#F0EFFE]'
                    : 'border-[#EEF0F4]'
                }`}
                onClick={() => handleValueChange(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleValueChange(false);
                  }
                }}
              >
                <span>No</span>
              </div>
            </div>

            {helpText && fieldValue === true && (
              <div className="mt-4 p-4 bg-[#F0EFFE] rounded-lg flex items-start gap-2">
                <Info size={16} />
                <p className="text-sm text-gray-700">{helpText}</p>
              </div>
            )}

            {hasHelpLink && (
              <button
                type="button"
                className="text-sm text-[#5B52F9] mt-2 hover:underline"
              >
                Help me decide
              </button>
            )}
          </div>
        );
      }}
    />
  );
};
