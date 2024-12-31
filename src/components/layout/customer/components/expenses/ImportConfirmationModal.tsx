import SharedModal from '@/components/SharedModal';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Success from '../../../../../../public/Success.svg';
const ImportConfirmationModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SharedModal
      open={isOpen}
      onOpenChange={setIsOpen}
      customClassName="max-w-lg"
    >
      <div className="text-center space-y-4">
        <div className="relative mx-auto w-16 h-16">
          <Image src={Success} alt="Success" fill className="object-contain" />
        </div>

        <h2 className="text-lg font-semibold text-gray-900">
          Data imported successfully
        </h2>

        <p className="text-sm text-gray-600">
          We have also found expenses from the file and added them to the
          expense page.{' '}
          <a href="/expense" className="text-blue-600 underline">
            Click here
          </a>{' '}
          to visit the expense page and check the added expense.
        </p>

        <Button
          onClick={() => setIsOpen(false)}
          variant="purple"
          className="w-full"
        >
          Close
        </Button>
      </div>
    </SharedModal>
  );
};

export default ImportConfirmationModal;
