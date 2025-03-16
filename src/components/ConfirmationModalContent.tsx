import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

const ConfirmationModalContent = ({
  setModalOpen,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const handleCreateRules = () => {
    router.push('/customer/rules');
  };

  return (
    <div className="p-6 text-center">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Congratulations!</h2>
      <p className="text-gray-600 mb-6">
        Your bank statement has been successfully uploaded and processed.
      </p>

      <h3 className="text-lg font-medium mb-3">
        Next Step: Create Write-off Rules
      </h3>
      <p className="text-gray-600 mb-4">
        Now you can create rules to automatically categorize expenses and
        maximize your tax deductions.
      </p>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-md font-medium mb-2">Example:</h3>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="bg-blue-100 p-2 rounded text-sm">
            <p className="font-medium">Merchant</p>
            <p className="text-gray-600">Set 50% write-off</p>
          </div>
          <span className="text-gray-400">→</span>
          <div className="bg-green-100 p-2 rounded text-sm">
            <p className="font-medium">Tax Deduction</p>
            <p className="text-gray-600">Half of eligible expenses</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Creating rules helps you automatically apply the correct tax treatment
          to your expenses.
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          onClick={handleCreateRules}
          className="bg-[#5B52F9] hover:bg-[#4A41E8] text-white"
        >
          Create Rules Now
        </Button>
        <Button
          onClick={() => {
            setModalOpen(false);
          }}
          variant="outline"
          className="border-[#5B52F9] text-[#5B52F9] hover:bg-[#F0EFFE]"
        >
          I&apos;ll Do This Later
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationModalContent;
