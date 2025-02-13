import React, { useState } from 'react';

import SharedModal from '@/components/SharedModal';
import { Edit2 } from 'lucide-react';
import ExpenseAddContent from './ExpenseAddContent';
import { cn } from '@/lib/utils';

export type PayloadType = {
  amount: number;
  category: string;
  description: string;
  expense_type: string;
  sub_category: string;
  tag_category: string;
  transaction_date?: string;
  createdAt?: string;
  receipt?: {
    link: string;
    mimeType: string;
  };
  deduction_status?: string;
  __v?: number;
  _id: string;
};

export default function ExpenseUpdateModal({
  payload,
  rowClickEnabled = false,
  onClose,
}: {
  payload: PayloadType;
  rowClickEnabled?: boolean;
  onClose?: () => void;
}) {
  const [isModalOpen, setModalOpen] = useState(rowClickEnabled ? true : false);
  const handleButtonClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <Edit2
        className={cn(
          'h-4 w-4 text-[#5B52F9] cursor-pointer mr-2',
          rowClickEnabled && 'sr-only'
        )}
        onClick={handleButtonClick}
      />
      <div className="bg-white z-50">
        <SharedModal
          open={isModalOpen}
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) {
              if (onClose) {
                onClose();
              }
            }
          }}
          customClassName="max-w-[650px]"
        >
          <div className="bg-white">
            <ExpenseAddContent
              origin="expense update"
              setModalOpen={setModalOpen}
              payload={payload}
            />
          </div>
        </SharedModal>
      </div>
    </>
  );
}
