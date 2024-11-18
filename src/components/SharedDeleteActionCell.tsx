import { useState } from 'react';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import SharedModal from './SharedModal';
import DeleteConfirmationContent from './DeleteConfirmationContent';

const SharedDeleteActionCell = ({ itemId }: { itemId: string }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleDelete = () => {
    setModalOpen(true);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" className="h-8 w-8 p-0">
        <Trash2
          className="h-4 w-4 text-[#5B52F9] cursor-pointer"
          onClick={handleDelete}
        />
        <div className="bg-white z-50">
          <SharedModal
            open={isModalOpen}
            onOpenChange={setModalOpen}
            customClassName="max-w-[500px]"
          >
            <DeleteConfirmationContent
              ruleId={itemId}
              setModalOpen={setModalOpen}
            />
          </SharedModal>
        </div>
      </Button>
    </div>
  );
};
export default SharedDeleteActionCell;
