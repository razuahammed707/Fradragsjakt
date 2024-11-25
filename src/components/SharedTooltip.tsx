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
        <TooltipTrigger asChild>{visibleContent}</TooltipTrigger>
        <TooltipContent className="bg-white shadow-lg border">
          <div className="bg-white">{children}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default SharedTooltip;
