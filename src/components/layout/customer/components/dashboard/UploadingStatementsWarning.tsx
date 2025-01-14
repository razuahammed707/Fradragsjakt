import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/TranslationProvider';
import { IoMdAdd } from 'react-icons/io';
import SharedModal from '@/components/SharedModal';
import StatementUploadContent from '@/components/StatementUploadContent';
import ConfirmationModalContent from '@/components/ConfirmationModalContent';

const UploadingStatementsWarning = () => {
  const { translate } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ key: '' });

  const handleButtonClick = (type: any) => {
    if (type === 'uploadStatements') {
      setModalContent({ key: 'uploadStatements' });
      setModalOpen(true);
    }
  };

  const renderModalContent = () => {
    if (modalContent.key === 'uploadStatements') {
      return <StatementUploadContent setModalContent={setModalContent} />;
    }
    if (modalContent.key === 'confirmation') {
      return <ConfirmationModalContent setModalOpen={setModalOpen} />;
    }
    return null;
  };

  return (
    <>
      <div className="bg-[#FFE2E2] text-[#50647C] text-md rounded-xl mb-2 px-4 py-2 justify-between items-center flex">
        Connect with bank or Upload bank statements to start managing your
        expenses, income, write-offs !
        <div className="space-x-4 flex items-center">
          <Button
            className="text-white"
            disabled={true}
            onClick={() => console.log('Connect to bank clicked - disabled')}
          >
            Connect to bank
          </Button>
          <p>or</p>
          <Button
            variant="purple"
            onClick={() => handleButtonClick('uploadStatements')}
          >
            <IoMdAdd className="font-bold mr-2" />
            {translate(
              'components.buttons.income_buttons.text.upload_statements'
            )}
          </Button>
        </div>
      </div>

      <SharedModal
        open={isModalOpen}
        onOpenChange={setModalOpen}
        customClassName="max-w-[650px]"
      >
        <div className="bg-white">{renderModalContent()}</div>
      </SharedModal>
    </>
  );
};

export default UploadingStatementsWarning;
