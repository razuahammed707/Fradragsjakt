import { Info } from 'lucide-react';

interface YesNoInputProps {
  value: boolean | undefined;
  name: string;
  setValue: any;
  yesText?: string;
  helpText?: string;
  hasHelpLink?: boolean;
  customClassName?: string;
  singleLine?: boolean;
  label?: string;
}

export const YesNoInput = ({
  value,
  name,
  setValue,
  yesText = 'Yes',
  helpText,
  hasHelpLink,
  customClassName = '',
  singleLine = false,
  label,
}: YesNoInputProps) => {
  const handleValueChange = (newValue: boolean) => {
    if (value !== newValue) {
      setValue(name, newValue, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  if (singleLine) {
    return (
      <div className={`w-full ${customClassName}`}>
        <div className="flex items-center space-x-3">
          <span className="text-sm font-semibold text-gray-900">{label}</span>
          <div className="inline-flex gap-2">
            <button
              type="button"
              onClick={() => handleValueChange(false)}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all shadow-sm
                ${
                  value === false
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600 ring-indigo-500'
                    : 'border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50/60'
                }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => handleValueChange(true)}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all shadow-sm
                ${
                  value === true
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600 ring-indigo-500'
                    : 'border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50/60'
                }`}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Original stacked layout
  return (
    <div className={`w-full ${customClassName}`}>
      <div className="flex flex-col gap-2">
        <div
          role="button"
          tabIndex={0}
          className={`w-full p-3 text-left border-2 rounded-lg hover:border-[#5B52F9] transition-all ${
            value === true
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
            value === false
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

      {helpText && value === true && (
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
};
