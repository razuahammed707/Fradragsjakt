import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ReactNode } from 'react';

type TooltipProps = {
  children: ReactNode;
  visibleContent: ReactNode;
};

function SharedTooltip({ children, visibleContent }: TooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{visibleContent}</TooltipTrigger>
        <TooltipContent>
          <div className="bg-white">{children}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default SharedTooltip;
