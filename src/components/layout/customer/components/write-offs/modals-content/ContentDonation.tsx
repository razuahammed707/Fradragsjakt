import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { transformFormDataToPayload } from '@/utils/helpers/transformFormDataAsPayload';
import {
  addQuestionnaire,
  questionnaireSelector,
  showModal,
} from '@/redux/slices/questionnaire';
import { FormInput } from '@/components/FormInput';
import { FormReceiptInput } from '@/components/FormReceiptInput';

export function ContentDonation() {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isDirty, isValid },
  } = useForm();

  const appDispatch = useAppDispatch();
  const { questionnaires } = useAppSelector(questionnaireSelector);
  console.log(questionnaires);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (formData: any) => {
    const question = 'Gifts/Donations';
    const payload = transformFormDataToPayload(question, formData);
    appDispatch(addQuestionnaire(payload));
    appDispatch(showModal(false));
  };
  return (
    <Card className="border-none shadow-none p-0">
      <p className="text-xs  text-gray-500">Review Questionnaire</p>
      <CardHeader className="px-0 ">
        <CardTitle className="start text-xl font-semibold">
          Gifts to voluntary organisations
        </CardTitle>
        <CardDescription className="text-xs">
          If you have given a monetary donation of at least NOK 500 to a
          voluntary organisation and/or religious or belief-based community, you
          can get a deduction for this.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Donation Amount</Label>
              <FormInput
                name="Gifts to voluntary organisations.Donation Amount"
                customClassName="w-full"
                type="number"
                control={control}
                placeholder="Donation amount"
                required
              />
              <Label className="text-black pt-[12px] pb-[6px]">
                Upload verification document
              </Label>
              <FormReceiptInput
                name="Gifts to voluntary organisations.Upload verification document"
                control={control}
                setValue={setValue}
              />
            </div>
          </div>
          <Button
            disabled={!isDirty || !isValid}
            type="submit"
            className="text-white w-full"
          >
            Done
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
