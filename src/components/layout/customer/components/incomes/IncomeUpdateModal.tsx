import React, { useState } from 'react';
import SharedModal from '@/components/SharedModal';
import { Edit2, Trash2 } from 'lucide-react';
import IncomeAddContent from './IncomeAddContent';
import DeleteRowsConfirmationContent from '@/components/DeleteConfirmationContent';

export type PayloadType = {
  amount: number;
  category: string;
  sub_category: string;
  tag_category: string;
  description: string;
  income_type: string;
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

export default function IncomeUpdateModal({
  payload,
  onClose,
}: {
  payload: PayloadType;
  onClose?: () => void;
}) {
  const [isModalOpen, setModalOpen] = useState(false);
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
        className="h-4 w-4 text-[#5B52F9] cursor-pointer mr-2"
        onClick={handleButtonClick}
      />
      <div className="bg-white z-50">
        <SharedModal
          open={isModalOpen}
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open && onClose) {
              onClose();
            }
          }}
          customClassName="max-w-[650px]"
        >
          <div className="bg-white">
            {showDeleteConfirmation ? (
              <DeleteRowsConfirmationContent
                itemId={payload._id}
                itemOrigin="income"
                setModalOpen={setModalOpen}
                onDeleteComplete={onClose}
              />
            ) : (
              <>
                <IncomeAddContent
                  origin="income update"
                  setModalOpen={setModalOpen}
                  payload={payload}
                />
                <div className="flex justify-center mt-6 pt-4 border-t">
                  <button
                    onClick={handleDeleteClick}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Income
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
