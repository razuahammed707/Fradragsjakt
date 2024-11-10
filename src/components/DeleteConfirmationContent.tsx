'use client';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import React from 'react';
import { Button } from './ui/button';
import { trpc } from '@/utils/trpc';

interface IDeleteProps {
  ruleId: string;
  setModalOpen: (open: boolean) => void;
}

function DeleteConfirmationContent({ ruleId, setModalOpen }: IDeleteProps) {
  const deleteRuleMutation = trpc.rules.deleteRule.useMutation();
  const utils = trpc.useUtils();
  const handleDelete = () => {
    deleteRuleMutation.mutate({ _id: String(ruleId) });
    utils.rules.getRules.invalidate();
    setModalOpen(false);
  };
  return (
    <div className="bg-white w-full mt-5">
      <div className="flex flex-col items-center">
        <CrossCircledIcon className="text-red-400 w-12 h-12 mb-3" />
        <p className="text-xl">Do you really want to delete the rule?.</p>
      </div>
      <div className="mt-5">
        <Button className="bg-red-500 text-white mr-3" onClick={handleDelete}>
          Confirm
        </Button>
        <Button className="bg-gray-200 hover:bg-gray-200">Discard</Button>
      </div>
    </div>
  );
}

export default DeleteConfirmationContent;
