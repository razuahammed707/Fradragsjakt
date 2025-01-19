'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SharedModal from '@/components/SharedModal';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import IncomeImg from '../../../../../../public/images/dashboard/welcome-modal/income-page.png';
import ExpenseImg from '../../../../../../public/images/dashboard/welcome-modal/expense-page.png';
import RulesImg from '../../../../../../public/images/dashboard/welcome-modal/rules-page.png';
import CategoryImg from '../../../../../../public/images/dashboard/welcome-modal/category-page.png';
import WriteOffImg from '../../../../../../public/images/dashboard/welcome-modal/write-off-page.png';
import WelcomeImg from '../../../../../../public/images/dashboard/welcome-modal/welcoming-greet.png';
import { trpc } from '@/utils/trpc';

const FEATURES = [
  {
    title: 'Income Page',
    description:
      'Manage personal and deductible income, enabling you to organize and track your earnings, separating taxable and non-taxable income sources to maintain accurate records and optimize your tax planning.',
    image: IncomeImg,
  },
  {
    title: 'Expense Page',
    description:
      'Manage personal and deductible business expenses, organize them into categories, and differentiate between personal and business expenses, ensuring accurate financial records and maximizing potential tax savings.',
    image: ExpenseImg,
  },
  {
    title: 'Rules Page',
    description:
      'Rules for income and expenses enables you to automate categorization by setting conditions, such as assigning specific transactions to predefined categories based on description.',
    image: RulesImg,
  },
  {
    title: 'Categories Page',
    description:
      'Categories for income and expenses allows you to create, edit, or organize specific categories to better track your financial activities and tailor them to your personal or business needs.',
    image: CategoryImg,
  },
  {
    title: 'Write-Off Page',
    description:
      'Lets you review eligible tax-saving expenses and incomes while the Tax Write-Off Calculator helps estimate how much you can save by deducting these expenses from your taxable income. You can also generate and download your reports easily.',
    image: WriteOffImg,
  },
];

const DashboardWelcomeModal = () => {
  const { data: loggedUser, isLoading } = trpc.users.getUserByEmail.useQuery();
  const updateUserMutation = trpc.users.updateUser.useMutation();

  const [isModalOpen, setModalOpen] = useState(true);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  const handleCarouselSelect = useCallback(() => {
    if (carouselApi) {
      setCanScrollPrev(carouselApi.canScrollPrev());
    }
  }, [carouselApi]);

  useEffect(() => {
    if (isLoading) {
      setModalOpen(false);
    } else if (loggedUser?.isSawInstructions) {
      setModalOpen(!loggedUser.isSawInstructions);
    }
  }, [loggedUser, isLoading]);

  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.on('select', handleCarouselSelect);
    handleCarouselSelect();

    return () => {
      carouselApi.off('select', handleCarouselSelect);
    };
  }, [carouselApi, handleCarouselSelect]);

  const handleModalChange = (value: boolean) => {
    updateUserMutation.mutate({ isSawInstructions: true });
    setModalOpen(value);
  };

  const handleGetStartedClick = () => {
    updateUserMutation.mutate({ isSawInstructions: true });
    setModalOpen(false);
  };

  const FeatureCard = ({
    title,
    description,
    image,
  }: (typeof FEATURES)[number]) => (
    <CarouselItem className="basis-[269px]">
      <div className="h-[393px] bg-gray-50 flex flex-col justify-between rounded-[18px] overflow-hidden">
        <div className="p-[18px]">
          <h3 className="text-[21px] text-[#18181B] font-bold mb-[10px]">
            {title}
          </h3>
          <p className="text-[#71717A] text-xs font-medium">{description}</p>
        </div>
        <div className="flex justify-end">
          <Image
            src={image}
            height={219}
            width={271}
            alt={`${title} Screenshot`}
          />
        </div>
      </div>
    </CarouselItem>
  );

  return (
    <SharedModal
      open={isModalOpen}
      onOpenChange={handleModalChange}
      customClassName="max-w-[934px] p-0"
    >
      <Card className="shadow-none overflow-hidden">
        <CardContent className="flex p-0">
          <div className="px-6 py-12 flex flex-col justify-between  w-[323px] h-[546px]">
            <Image
              src={WelcomeImg}
              height={285}
              width={225}
              alt="Welcoming Greet"
            />
            <div className="space-y-4">
              <h2 className="text-[#18181B] text-[22px] font-bold ">
                Welcome aboard!
              </h2>
              <p className="text-[13px] text-[#3E3E3E]">
                Lets take a quick look at our features , So you know how to
                manage your incomes , expenses , creation of rules, categories
                and write offs effortlessly.
              </p>
              <Button
                onClick={handleGetStartedClick}
                className="text-white text-xs font-medium py-3 w-[190px]"
              >
                Let&apos;s Get Started
              </Button>
            </div>
          </div>

          <Carousel
            opts={{
              align: 'start',
              slidesToScroll: 1,
              containScroll: 'trimSnaps',
            }}
            setApi={setCarouselApi}
            style={{
              background:
                'linear-gradient(293deg, #C9CEDF 1.06%, #EBEEFB 98.94%)',
            }}
            className="w-[611px] flex items-center rounded-md border-none shadow-none py-0 ps-6 pr-0"
          >
            <CarouselContent>
              {FEATURES.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </CarouselContent>

            {canScrollPrev && (
              <CarouselPrevious className="left-6 hover:bg-primary hover:text-primary-foreground rounded-l-[20px] bg-[rgba(0,16,75,0.58)] h-[37px] w-[40px] text-white" />
            )}
            <CarouselNext className="right-0 hover:bg-primary hover:text-primary-foreground rounded-r-[20px] bg-[rgba(0,16,75,0.58)] h-[37px] w-[40px] text-white" />
          </Carousel>
        </CardContent>
      </Card>
    </SharedModal>
  );
};

export default DashboardWelcomeModal;
