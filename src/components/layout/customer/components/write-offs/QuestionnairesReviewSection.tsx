'use client';

import { Pencil } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import QuestionedAvatar from '../../../../../../public/images/dashboard/avatar-with-question.svg';
import MarkIcon from '../../../../../../public/images/dashboard/mark.svg';
import CrossIcon from '../../../../../../public/images/dashboard/cross.svg';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SharedModal from '@/components/SharedModal';
import { trpc } from '@/utils/trpc';
import { questionMatcherEngine } from '@/utils/helpers/questionMatcherEngine';

import { ContentHealthFamily } from './modals-content/ContentHealthFamily';
import { ContentBank } from './modals-content/ContentBank';
import { ContentWork } from './modals-content/ContentWork';
import { ContentHobby } from './modals-content/ContentHobby';
import { ContentDonation } from './modals-content/ContentDonation';
import { ContentForeignIncome } from './modals-content/ContentForeignIncome';
import { Questionnaire } from '@/types/questionnaire';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { questionnaireSelector, showModal } from '@/redux/slices/questionnaire';
import EditResponseModalContent from './modals-content/EditResponseModalContent';
import { cn } from '@/lib/utils';
import { ContentHousing } from './modals-content/ContentHousing';
import { savingExpenseCalculator } from '@/utils/helpers/savingExpenseCalculator';
import { useTranslation } from '@/lib/TranslationProvider'; // Importing useTranslation

const modalContentMap: Record<
  string,
  (props: { questionnaire: Questionnaire }) => React.ReactNode
> = {
  'Health and Family': ({ questionnaire }) => (
    <ContentHealthFamily questionnaire={questionnaire} />
  ),
  'Bank and Loans': ({ questionnaire }) => (
    <ContentBank questionnaire={questionnaire} />
  ),
  'Work and Education': ({ questionnaire }) => (
    <ContentWork questionnaire={questionnaire} />
  ),
  'Hobby, Odd jobs, and Extra incomes': ({ questionnaire }) => (
    <ContentHobby questionnaire={questionnaire} />
  ),
  'Housing and Property': ({ questionnaire }) => (
    <ContentHousing questionnaire={questionnaire} />
  ),
  'Gifts or Donations': () => <ContentDonation />,
  'Foreign Income': ({ questionnaire }) => (
    <ContentForeignIncome questionnaire={questionnaire} />
  ),
  'Edit Response': () => <EditResponseModalContent />,
};

const QuestionnairesReviewSection = () => {
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const dispatch = useAppDispatch();
  const { questionnaires } = useAppSelector(questionnaireSelector);
  const { isModalOpen } = useAppSelector(questionnaireSelector);
  const { data: user } = trpc.users.getUserByEmail.useQuery();
  const { translate } = useTranslation(); // Translation function

  const {
    workAndEducationExpenseAmount,
    healthAndFamilyExpenseAmount,
    bankAndLoansExpenseAmount,
    hobbyOddjobsAndExtraIncomesExpenseAmount,
    housingAndPropertyExpenseAmount,
    giftsOrDonationsExpenseAmount,
    foreignIncomeExpenseAmount,
  } = savingExpenseCalculator(questionnaires, user?.questionnaires);

  const data = [
    { title: 'Health and Family', amount: healthAndFamilyExpenseAmount },
    { title: 'Bank and Loans', amount: bankAndLoansExpenseAmount },
    { title: 'Work and Education', amount: workAndEducationExpenseAmount },
    { title: 'Housing and Property', amount: housingAndPropertyExpenseAmount },
    { title: 'Gifts or Donations', amount: giftsOrDonationsExpenseAmount },
    {
      title: translate('hobbyOddJobs.title'),
      amount: hobbyOddjobsAndExtraIncomesExpenseAmount,
    },
    {
      title: translate('foreignIncome.title'),
      amount: foreignIncomeExpenseAmount,
    },
  ];

  const handleButtonClick = (title: string) => {
    setSelectedTitle(title);
    dispatch(showModal(true));
  };

  const renderModalContent = () => {
    const userQuestionnaires = user?.questionnaires || [];

    const matchedQuestionnaire = questionMatcherEngine(
      selectedTitle,
      userQuestionnaires
    ) as Questionnaire;

    const ModalContent = modalContentMap[selectedTitle];

    return ModalContent ? (
      ModalContent({ questionnaire: matchedQuestionnaire })
    ) : (
      <></>
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    dispatch(showModal(isOpen));
  };

  return (
    <>
      <div className="col-span-3 flex border flex-col justify-between bg-white sticky top-0 rounded-2xl h-[calc(100vh-116px)] p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Image
              src={QuestionedAvatar}
              alt={translate('avatar.alt')}
              height={52}
              width={54}
            />
            <Pencil
              onClick={() => handleButtonClick(translate('editResponse.title'))}
              className="h-4 w-4 text-[#5B52F9] cursor-pointer"
            />
          </div>
          <div>
            <h4 className="text-sm text-[#101010] font-semibold">
              {translate('review.title')}
            </h4>
            <p className="text-xs text-[#71717A] font-medium">
              {translate('review.subtitle')}
            </p>
          </div>
        </div>
        <div className="text-sm text-[#101010] space-y-4">
          {data.map((question, i) => (
            <div
              key={i}
              onClick={() => handleButtonClick(question.title)}
              className="flex justify-between items-center p-2 bg-[#F0EFFE] rounded-md cursor-pointer hover:bg-cyan-100"
            >
              <div className="flex space-x-2">
                <Image
                  src={question.amount === 0 ? CrossIcon : MarkIcon}
                  alt={translate('question.alt')}
                  height={18}
                  width={18}
                />
                <p>{question.title}</p>
              </div>
              {question.amount !== 0 && <p>NOK {question.amount.toFixed(2)}</p>}
            </div>
          ))}
          <Separator className="bg-[#E4E4E7] my-6" />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p>{translate('savings.questions')}</p>
              <p className="font-medium">NOK 800</p>
            </div>
            <div className="flex justify-between items-center">
              <p>{translate('savings.potential')}</p>
              <p className="font-medium">NOK 2,086</p>
            </div>
          </div>
          <Separator className="bg-[#E4E4E7] my-6" />
          <div className="flex justify-between items-center font-medium">
            <p>{translate('total.writeOffs')}</p>
            <p>NOK 2,886</p>
          </div>
        </div>
        <Button
          onClick={() => handleButtonClick(translate('editResponse.title'))}
          className="text-white text-sm font-medium"
        >
          {translate('editResponse.button')}
        </Button>
      </div>
      <SharedModal
        open={isModalOpen}
        onOpenChange={handleOpenChange}
        customClassName={cn(
          'max-w-[500px]',
          selectedTitle === translate('editResponse.title') && 'max-w-[608px]'
        )}
      >
        <div className="bg-white">{renderModalContent()}</div>
      </SharedModal>
    </>
  );
};

export default QuestionnairesReviewSection;
