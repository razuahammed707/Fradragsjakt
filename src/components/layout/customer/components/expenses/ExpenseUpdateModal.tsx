import React, { useState, useCallback } from 'react';
import SharedModal from '@/components/SharedModal';
import { Edit2, Trash2 } from 'lucide-react';
import ExpenseAddContent from './ExpenseAddContent';
import DeleteRowsConfirmationContent from '@/components/DeleteConfirmationContent';
import { Button } from '@/components/ui/button';

export type PayloadType = {
  _id: string;
  id: string;
  transaction_date?: string | Date;
  createdAt?: string;
  description: string;
  category: string;
  sub_category?: string;
  tag_category?: string;
  expense_type: 'business' | 'personal' | 'unknown';
  amount: number;
  note?: string;
  receipt?: {
    link: string;
    mimeType: string;
  } | null;
};

export default function ExpenseUpdateModal({
  payload,
  rowClickEnabled = true,
  onClose,
}: {
  payload: PayloadType;
  rowClickEnabled?: boolean;
  onClose?: () => void;
}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isRowClickEnabled, setRowClickEnabled] = useState(rowClickEnabled);

  React.useEffect(() => {
    setModalOpen(true);
  }, []);

  const handleButtonClick = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirmation(true);
  }, []);

  const handleModalChange = useCallback(
    (open: boolean) => {
      setModalOpen(open);
      if (!open && onClose) {
        onClose();
      }
    },
    [onClose]
  );

  if (!payload) return null;

  return (
    <>
      {!isRowClickEnabled && (
        <Edit2
          className="h-4 w-4 text-[#5B52F9] cursor-pointer mr-2 hover:text-[#4A43C8] transition-colors"
          onClick={handleButtonClick}
          aria-label="Edit Expense"
        />
      )}
      <div className="bg-white z-50">
        <SharedModal
          open={isModalOpen}
          onOpenChange={handleModalChange}
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
                  onSuccess={() => {
                    setRowClickEnabled(true);
                    handleModalChange(false);
                  }}
                />
                <p className="text-sm my-1 text-center text-gray-500">Or</p>
                <div className="flex justify-center">
                  <Button
                    onClick={handleDeleteClick}
                    className="w-full bg-transparent hover:bg-red-50 shadow-none border text-red-600 hover:text-red-700 transition-colors"
                    title="Delete Expense"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Expense
                  </Button>
                </div>
              </>
            )}
          </div>
        </SharedModal>
      </div>
    </>
  );
}
