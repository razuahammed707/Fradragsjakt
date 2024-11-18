import { useState } from 'react';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import SharedModal from './SharedModal';
import DeleteConfirmationContent from './DeleteConfirmationContent';

const SharedDeleteActionCell = ({
  textVisible,
  itemId,
  itemOrigin,
}: {
  itemId: string;
  itemOrigin: string;
  textVisible?: boolean;
}) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  console.log('__isOpen', isModalOpen);

  const handleDelete = () => {
    setModalOpen(true);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={handleDelete}
        variant="ghost"
        className={cn('h-8 w-full flex justify-start px-2')}
      >
        <Trash2 className="h-4 w-4 text-[#5B52F9] cursor-pointer" />
        {textVisible && <span className="ms-2">Delete</span>}
        <div className="bg-white z-50">
          <SharedModal
            open={isModalOpen}
            onOpenChange={setModalOpen}
            customClassName="max-w-[500px]"
          >
            <DeleteConfirmationContent
              itemId={itemId}
              itemOrigin={itemOrigin}
              setModalOpen={setModalOpen}
            />
          </SharedModal>
        </div>
      </Button>
    </div>
  );
};
export default SharedDeleteActionCell;
