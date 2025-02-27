import React, { useState } from 'react';
import SharedModal from '@/components/SharedModal';
import { Edit2, Trash2 } from 'lucide-react';
import ExpenseAddContent from './ExpenseAddContent';
import DeleteRowsConfirmationContent from '@/components/DeleteConfirmationContent';
import { cn } from '@/lib/utils';

export type PayloadType = {
  amount: number;
  category: string;
  description: string;
  expense_type: string;
  transaction_date?: string;
  note?: string;
  createdAt?: string;
  receipt?: {
    link: string;
    mimeType: string;
  };
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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleButtonClick = () => {
    setModalOpen(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
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
            {showDeleteConfirmation ? (
              <DeleteRowsConfirmationContent
                itemId={payload._id}
                itemOrigin="expense"
                setModalOpen={setModalOpen}
                onDeleteComplete={onClose}
              />
            ) : (
              <>
                <ExpenseAddContent
                  origin="expense update"
                  setModalOpen={setModalOpen}
                  payload={payload}
                />
                <div className="flex justify-center mt-6 pt-4 border-t">
                  <button
                    onClick={handleDeleteClick}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Expense
                  </button>
                </div>
              </>
            )}
          </div>
        </SharedModal>
      </div>
    </>
  );
}
