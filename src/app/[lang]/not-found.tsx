import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import NotFoundImage from '../../../public/NotFound.svg';

const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex py-8 flex-col justify-end gap-[24px] items-center rounded-lg w-[290px]">
        <Image src={NotFoundImage} alt="Not found" width={238} height={187} />
        <h1 className="font-semibold">Oops, page is not found!</h1>
        <h3 className="text-gray-500 text-sm">
          This link might be broken or corrupted.
        </h3>
        <Link href="/">
          <Button className="text-white" variant={'purple'}>
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
