import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ExpertIcon from '../../public/xpert_assist.svg';
import DocumentImage from '../../public/document.svg';
import { useTranslation } from '@/lib/TranslationProvider';

const HelpAskingCard = () => {
  const { translate } = useTranslation();

  return (
    <div className="flex flex-col mt-52 w-full">
      <div className="flex flex-col items-center px-6 py-6 w-full bg-indigo-50 rounded-2xl min-h-[213px]">
        <Image
          src={ExpertIcon}
          alt="Expert Icon"
          width={51}
          height={51}
          className="object-contain aspect-square"
        />
        <div className="flex flex-col mt-6 w-full max-w-[165px]">
          <div className="flex flex-col items-center self-center text-zinc-500">
            <p className="text-sm font-semibold leading-none">
              {translate('page.dashboard.help')}
            </p>
            <p className="text-xs leading-loose text-center">
              {translate('page.dashboard.check')}
            </p>
          </div>
          <Link
            href="/documentation"
            className="flex gap-2.5 justify-center items-center px-4 py-1.5 mt-4 w-full text-sm font-medium leading-6 text-white whitespace-nowrap bg-indigo-500 rounded-md min-h-[36px]"
          >
            <Image
              src={DocumentImage}
              alt="Documentation Icon"
              width={20}
              height={20}
              className="object-contain shrink-0 self-stretch my-auto"
            />
            <span className="self-stretch my-auto">
              {translate('page.dashboard.documentation')}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HelpAskingCard;
