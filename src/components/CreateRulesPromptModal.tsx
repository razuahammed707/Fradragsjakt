import React from 'react';
import SharedModal from '@/components/SharedModal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface CreateRulesPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRulesPromptModal({
  isOpen,
  onClose,
}: CreateRulesPromptModalProps) {
  const router = useRouter();

  const handleCreateRules = () => {
    router.push('/customer/rules');
    onClose();
  };

  return (
    <SharedModal
      open={isOpen}
      onOpenChange={onClose}
      customClassName="max-w-[500px]"
    >
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">
          Get Started with Write-offs
        </h2>
        <p className="text-gray-600 mb-6">
          Create rules to fine tune your expenses and maximize your deductions.
          Add percentages to your category to start getting the write offs.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleCreateRules}
            className="bg-[#5B52F9] hover:bg-[#4A41E8] text-white"
          >
            Create Rules
          </Button>
          <Button
            onClick={onClose}
            className="bg-[#5B52F9] hover:bg-[#4A41E8] text-white"
          >
            Later
          </Button>
        </div>
      </div>
    </SharedModal>
  );
}
