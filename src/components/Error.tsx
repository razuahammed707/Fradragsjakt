// components/ErrorComponent.js
'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import NewErrorImg from '../../public/NewErrorImage.svg';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const Error: React.FC<ErrorProps> = ({ error, reset }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white p-6">
      <div className="rounded-lg p-8 max-w-lg text-center w-[564px]">
        <h2 className="text-2xl font-bold text-black mb-4 justify-items-center">
          {' '}
          <Image
            src={NewErrorImg}
            width={236}
            height={211}
            alt="Picture of the error"
          />
          {error.message}
        </h2>

        <p className="text-gray-600 mb-6 text-sm">
          Please try again later or contact support if the problem persists.
        </p>

        <div className="flex space-x-4 justify-center">
          <Button
            className="px-6 py-3 text-white rounded-md font-semibold transition duration-300 ease-in-out w-full"
            variant={'purple'}
            onClick={reset}
          >
            Try again
          </Button>
          <Link href="/" className="w-full">
            <Button
              className="px-6 py-3 text-white rounded-md font-semibold transition duration-300 ease-in-out w-full"
              variant={'purple'}
            >
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;
