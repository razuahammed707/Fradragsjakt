import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Success from '../../public/Success.svg';
import useIsWithinIncomes from '@/hooks/is-within-incomes';
import { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
const ConfirmationModalContent = ({
  setModalOpen,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const isIncome = useIsWithinIncomes();
  const { data: session } = useSession();

  return (
    <div className="text-center space-y-4">
      <div className="relative mx-auto w-16 h-16">
        <Image src={Success} alt="Success" fill className="object-contain" />
      </div>

      <h2 className="text-lg font-semibold text-gray-900">
        {`${isIncome ? 'Incomes' : 'Expenses'} are created successfully`}
      </h2>

      {isIncome ? (
        <p className="text-sm text-gray-600">
          We have also found expenses from the file and added them as well.{' '}
          <Link
            href={`/${session?.user?.role}/expenses`}
            className="text-blue-600 underline"
          >
            Click here
          </Link>{' '}
          to visit the expense page and check the added expenses.
        </p>
      ) : (
        <p className="text-sm text-gray-600">
          We have also found incomes from the file and added them as well.{' '}
          <Link
            href={`/${session?.user?.role}/incomes`}
            className="text-blue-600 underline"
          >
            Click here
          </Link>{' '}
          to visit the income page and check the added incomes.
        </p>
      )}

      <Button
        onClick={() => setModalOpen(false)}
        variant="purple"
        className="w-full"
      >
        Close
      </Button>
    </div>
  );
};

export default ConfirmationModalContent;
