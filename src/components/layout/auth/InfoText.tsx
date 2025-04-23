import { Info } from 'lucide-react';

interface InfoTextProps {
  selectedOptions: string[];
}

export function InfoText({ selectedOptions }: InfoTextProps) {
  if (
    !selectedOptions.some((type) => ['freelance', 'business'].includes(type))
  ) {
    return null;
  }

  return (
    <div className="w-[740px] mx-auto mt-8">
      <div className="p-4 bg-[#F0EFFE] rounded-lg border border-[#E2E0FF]">
        <div className="flex items-start">
          <div className="mr-2 mt-1">
            <Info size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">
                Perfect! Skattepluss is especially great for business owners.
              </span>
              <br />
              Let&apos;s start by uncovering the deductions that being a
              business owner make you eligible for!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
