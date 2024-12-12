'use client';

import { View } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useTranslation } from '@/lib/TranslationProvider';
import QuestionedAvatar from '../../../../../../public/images/dashboard/avatar-with-question.svg';
import MarkIcon from '../../../../../../public/images/dashboard/mark.svg';
import CrossIcon from '../../../../../../public/images/dashboard/cross.svg';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SharedModal from '@/components/SharedModal';
import { trpc } from '@/utils/trpc';
import { questionMatcherEngine } from '@/utils/helpers/questionMatcherEngine';

// Modal content components
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
import { numberFormatter } from '@/utils/helpers/numberFormatter';
import { manipulatePersonalDeductions } from '@/utils/helpers/manipulatePersonalDeductions';
import SharedReportDownloader from '@/components/SharedReportDownloader';
import ViewResponseModalContent from './modals-content/ViewResponseModalContent';

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
  'View Response': () => <ViewResponseModalContent />,
};

const QuestionnairesReviewSection = () => {
  const { translate } = useTranslation();
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  const dispatch = useAppDispatch();
  const { questionnaires } = useAppSelector(questionnaireSelector);
  const { isModalOpen } = useAppSelector(questionnaireSelector);
  const { data: user } = trpc.users.getUserByEmail.useQuery();
  const {
    workAndEducationExpenseAmount,
    healthAndFamilyExpenseAmount,
    bankAndLoansExpenseAmount,
    hobbyOddjobsAndExtraIncomesExpenseAmount,
    housingAndPropertyExpenseAmount,
    giftsOrDonationsExpenseAmount,
    foreignIncomeExpenseAmount,
  } = savingExpenseCalculator(questionnaires, user?.questionnaires);

  const personalData = manipulatePersonalDeductions(questionnaires, user);

  const personalTotal = personalData?.reduce(
    (sum, current) => sum + current.total_amount,
    0
  );
  const getWriteOffs = () => {
    return [
      {
        title: translate('questionnaire.health_family'),
        amount: healthAndFamilyExpenseAmount,
      },
      {
        title: translate('questionnaire.bank_loans'),
        amount: bankAndLoansExpenseAmount,
      },
      {
        title: translate('questionnaire.work_education'),
        amount: workAndEducationExpenseAmount,
      },
      {
        title: translate('questionnaire.housing_property'),
        amount: housingAndPropertyExpenseAmount,
      },
      {
        title: translate('questionnaire.gifts_donations'),
        amount: giftsOrDonationsExpenseAmount,
      },
      {
        title: translate('questionnaire.hobby_extra_income'),
        amount: hobbyOddjobsAndExtraIncomesExpenseAmount,
      },
      {
        title: translate('questionnaire.foreign_income'),
        amount: foreignIncomeExpenseAmount,
      },
    ];
  };
  const titleKeyMap: Record<string, string> = {
    [translate('questionnaire.health_family')]: 'Health and Family',
    [translate('questionnaire.bank_loans')]: 'Bank and Loans',
    [translate('questionnaire.work_education')]: 'Work and Education',
    [translate('questionnaire.housing_property')]: 'Housing and Property',
    [translate('questionnaire.gifts_donations')]: 'Gifts or Donations',
    [translate('questionnaire.hobby_extra_income')]:
      'Hobby, Odd jobs, and Extra incomes',
    [translate('questionnaire.foreign_income')]: 'Foreign Income',
    [translate('questionnaire.edit_response')]: 'Edit Response',
    [translate('questionnaire.view_response')]: 'View Response',
  };
  const handleButtonClick = (title: string) => {
    // Map the translated title to the modal content key
    const mappedTitle = titleKeyMap[title];
    if (mappedTitle) {
      setSelectedTitle(mappedTitle);
      dispatch(showModal(true));
    } else {
      console.error('No matching key found for title:', title);
    }
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
              alt="Questioned Avatar"
              height={52}
              width={54}
            />
            <View
              onClick={() =>
                handleButtonClick(translate('questionnaire.view_response'))
              }
              className="h-5 w-5 text-[#5B52F9] cursor-pointer"
            />
          </div>
          <div>
            <h4 className="text-sm text-[#101010] font-semibold">
              {translate('questionnaire.review_title')}
            </h4>
            <p className="text-xs text-[#71717A] font-medium">
              {translate('questionnaire.review_subtitle')}
            </p>
          </div>
        </div>
        <div className="text-sm text-[#101010] space-y-4">
          {getWriteOffs().map((question, i) => (
            <div
              key={i}
              onClick={() => handleButtonClick(question.title)}
              className="flex justify-between items-center p-2 bg-[#F0EFFE] rounded-md cursor-pointer hover:bg-cyan-100"
            >
              <div className="flex space-x-2">
                <Image
                  src={question.amount === 0 ? CrossIcon : MarkIcon}
                  alt="titleImg1"
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
              <p>Savings from questions</p>
              <p className="font-medium">
                NOK {numberFormatter(personalTotal)}
              </p>
            </div>
            {/* <div className="flex justify-between items-center">
              <p>Potential Savings</p>
              <p className="font-medium">NOK 2,086</p>
            </div> */}
          </div>
          {/* <Separator className="bg-[#E4E4E7] my-6" />
          <div className="flex justify-between items-center font-medium">
            <p>Total (write-offs)</p>
            <p>NOK 2,886</p>
          </div> */}
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() =>
              handleButtonClick(translate('questionnaire.edit_response'))
            }
            className="text-white text-sm font-medium w-full"
          >
            {translate('questionnaire.edit_response')}
          </Button>
          <SharedReportDownloader
            body={getWriteOffs()}
            total={personalTotal}
            origin="write off questionnaires"
          />
        </div>
      </div>
      <SharedModal
        open={isModalOpen}
        onOpenChange={handleOpenChange}
        customClassName={cn(
          'max-w-[500px]',
          selectedTitle === translate('questionnaire.edit_response') &&
            'max-w-[608px]',
          selectedTitle === translate('questionnaire.view_response') &&
            'max-w-[600px]'
        )}
      >
        <div className="bg-white">{renderModalContent()}</div>
      </SharedModal>
    </>
  );
};

export default QuestionnairesReviewSection;
