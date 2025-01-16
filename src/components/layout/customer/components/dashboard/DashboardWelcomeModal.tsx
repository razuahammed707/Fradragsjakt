'use client';
import React, { useState } from 'react';
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
import { trpc } from '@/utils/trpc';

const DashboardWelcomeModal = () => {
  const { data: loggedUser, isLoading } = trpc.users.getUserByEmail.useQuery();

  const [isModalOpen, setModalOpen] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  React.useEffect(() => {
    if (isLoading) {
      setModalOpen(false);
    }
    if (loggedUser?.isSawInstructions) {
      setModalOpen(!loggedUser?.isSawInstructions);
    }
  }, [loggedUser, isLoading]);
  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
    };

    api.on('select', onSelect);
    onSelect();

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const features = [
    {
      title: 'Income Page',
      description:
        'Manage personal and deductible income" enables you to organize and track your earnings, separating taxable and non-taxable income sources to maintain accurate records and optimize your tax planning.',
      icon: <Image src={IncomeImg} height={191} width={191} alt="Income SS" />,
    },
    {
      title: 'Expense Page',
      description:
        'Manage personal and deductible business expenses, organize them into categories, and differentiate between personal and business expenses, ensuring accurate financial records and maximizing potential tax savings.',
      icon: (
        <Image src={ExpenseImg} height={219} width={271} alt="Expense SS" />
      ),
    },
    {
      title: 'Rules Page',
      description:
        'Rules for income and expenses enables you to automate categorization by setting conditions, such as assigning specific transactions to predefined categories based on description.',
      icon: <Image src={RulesImg} height={219} width={271} alt="Rules SS" />,
    },
    {
      title: 'Categories Page',
      description:
        'Categories for income and expenses allows you to create, edit, or organize specific categories to better track your financial activities and tailor them to your personal or business needs.',
      icon: (
        <Image src={CategoryImg} height={219} width={271} alt="Category SS" />
      ),
    },
    {
      title: 'Write-Off Page',
      description:
        'Lets you review eligible tax-saving expenses and incomes while the Tax Write-Off Calculator helps estimate how much you can save by deducting these expenses from your taxable income.you can also generate and download your reports easily.',
      icon: (
        <Image src={WriteOffImg} height={219} width={271} alt="Write Off SS" />
      ),
    },
  ];
  const updateUserMutation = trpc.users.updateUser.useMutation();

  const handleGetStartedClick = () => {
    updateUserMutation.mutate({ isSawInstructions: true });
    setModalOpen(false);
  };
  return (
    <>
      <SharedModal
        open={isModalOpen}
        onOpenChange={setModalOpen}
        customClassName="max-w-[934px] p-0 "
      >
        <Card className="shadow-none overflow-hidden">
          <CardContent className="flex p-0">
            <div className="px-6 pt-[51px] flex flex-col justify-between  pb-6 w-[323px] h-[546px]">
              <div>
                <h2 className="text-[#18181B] text-[26px] font-bold mb-3">
                  Welcome aboard!
                </h2>
                <p className=" text-[15px] text-[#3E3E3E]">
                  Lets take a quick look at our features , So you know how to
                  manage your incomes , expenses , creation of rules, categories
                  and write offs effortlessly.
                </p>
              </div>
              <div>
                <Button onClick={handleGetStartedClick} className="text-white">
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
              setApi={setApi}
              style={{
                background: `linear-gradient(293deg, #C9CEDF 1.06%, #EBEEFB 98.94%)`,
              }}
              className="w-[611px] flex items-center rounded-md border-none shadow-none py-0 ps-6 pr-0"
            >
              <CarouselContent className=" ">
                {features.map((feature, index) => (
                  <CarouselItem key={index} className="basis-[269px] ">
                    <div className="h-[393px]  bg-gray-50 flex flex-col justify-between rounded-[18px] ">
                      <div className="p-[18px] ">
                        <h3 className="text-[21px] text-[#18181B] font-bold mb-[10px]">
                          {feature.title}
                        </h3>
                        <p className="text-[#71717A] text-xs font-medium ">
                          {feature.description}
                        </p>
                      </div>
                      <div className="flex justify-end">{feature.icon}</div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {canScrollPrev && (
                <CarouselPrevious className="left-6  hover:bg-primary hover:text-primary-foreground rounded-none rounded-r-[20px] bg-[rgba(0,16,75,0.58)] h-[37px] w-[40px] text-white" />
              )}
              <CarouselNext className="right-0 hover:bg-primary hover:text-primary-foreground rounded-r-[20px] bg-[rgba(0,16,75,0.58)] h-[37px] w-[40px]  text-white" />
            </Carousel>
          </CardContent>
        </Card>
      </SharedModal>
    </>
  );
};

export default DashboardWelcomeModal;
