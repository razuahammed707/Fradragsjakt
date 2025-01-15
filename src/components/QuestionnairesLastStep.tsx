import Image from 'next/image';
import React, { useState } from 'react';
import connectToBankSVG from '../../public/connect-to-bank.svg';
import uploadStatementSVG from '../../public/upload-a-statement.svg';
import SharedModal from '../components/SharedModal';
import StatementUploadContent from '../components/StatementUploadContent';
import ConfirmationModalContent from './ConfirmationModalContent';
import useIsPopulatedStatements from '@/hooks/use-is-populated-statements';
import Success from '../../public/Success.svg';

const QuestionnairesLastStep = () => {
  const isPopulatedStatements = useIsPopulatedStatements();
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ key: '' });

  const handleUploadStatement = () => {
    setModalContent({ key: 'uploadStatements' });
    setModalOpen(true);
  };

  const renderModalContent = () => {
    if (modalContent.key === 'uploadStatements') {
      return (
        <StatementUploadContent
          setModalContent={setModalContent}
          setModalOpen={setModalOpen}
        />
      );
    }
    if (modalContent.key === 'confirmation') {
      return <ConfirmationModalContent setModalOpen={setModalOpen} />;
    }
    return null;
  };

  return (
    <div>
      {isPopulatedStatements ? (
        <div className="flex flex-col items-center space-y-4">
          <Image
            src={Success}
            alt="Success"
            width={150}
            height={300}
            className="object-contain"
          />

          <h2 className="text-lg font-semibold text-[#000]">
            Statement processed successfully.
          </h2>

          <p className="text-xs text-[#000] max-w-[328px]">
            We have found expenses and incomes from the file and they have been
            added to the expense and income page
          </p>
        </div>
      ) : (
        <>
          <div className="p-6 mb-4 bg-white rounded-lg border border-gray-200 opacity-50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image src={connectToBankSVG} alt="connect to bank svg" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-gray-900">
                  Connect to your bank
                </h3>
                <p className="text-sm text-gray-600">
                  Connecting to bank makes your calculations fast, seamless and
                  automated.
                </p>
              </div>
            </div>
          </div>
          <div
            onClick={handleUploadStatement}
            className="p-6 mb-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image src={uploadStatementSVG} alt="connect to bank svg" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-gray-900">
                  Upload your bank statement
                </h3>
                <p className="text-sm text-gray-600">
                  Uploading a statement gives you more control over your
                  transactions.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <SharedModal
        open={isModalOpen}
        onOpenChange={setModalOpen}
        customClassName="max-w-[650px]"
      >
        <div className="bg-white">{renderModalContent()}</div>
      </SharedModal>
    </div>
  );
};

export default QuestionnairesLastStep;
