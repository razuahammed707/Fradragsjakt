import Image from 'next/image';
import React, { useState } from 'react';
import connectToBankSVG from '../../public/connect-to-bank.svg';
import uploadStatementSVG from '../../public/upload-a-statement.svg';
import SharedModal from '../components/SharedModal';
import StatementUploadContent from '../components/StatementUploadContent';
import ConfirmationModalContent from './ConfirmationModalContent';
import Success from '../../public/Success.svg';
import useIsStatementsPopulated from '@/hooks/use-is-populated-statements';
import { Card } from '@/components/ui/card';

const QuestionnairesLastStep = () => {
  const { isStatementsPopulated } = useIsStatementsPopulated();
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
    <div className="space-y-4">
      {isStatementsPopulated ? (
        <div className="flex flex-col items-center space-y-4">
          <Image
            src={Success}
            alt="Success"
            width={150}
            height={300}
            className="object-contain"
          />

          <h2 className="text-lg font-semibold text-[#0F172A]">
            Statement processed successfully.
          </h2>

          <p className="text-sm text-[#64748B] max-w-[328px] text-center">
            We have found expenses and incomes from the file and they have been
            added to the expense and income page
          </p>
        </div>
      ) : (
        <>
          <Card className="p-6 border-[#EEF0F4] hover:border-[#5B52F9] transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image src={connectToBankSVG} alt="connect to bank svg" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-[#0F172A]">
                  Connect to your bank
                </h3>
                <p className="text-sm text-[#64748B]">
                  Connecting to bank makes your calculations fast, seamless and
                  automated.
                </p>
              </div>
            </div>
          </Card>
          <Card
            onClick={handleUploadStatement}
            className="p-6 border-[#EEF0F4] hover:border-[#5B52F9] transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image src={uploadStatementSVG} alt="connect to bank svg" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-[#0F172A]">
                  Upload your bank statement
                </h3>
                <p className="text-sm text-[#64748B]">
                  Uploading a statement gives you more control over your
                  transactions.
                </p>
              </div>
            </div>
          </Card>
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
