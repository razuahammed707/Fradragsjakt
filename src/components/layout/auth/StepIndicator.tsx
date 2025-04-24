import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StepIndicatorProps {
  currentStep: number;
  steps: any[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <Tabs value={currentStep.toString()} className="w-[740px] mx-auto mb-5">
      <TabsList className="w-full grid grid-cols-8 gap-2 bg-transparent ">
        {steps.map((_, index) => (
          <TabsTrigger
            key={index}
            value={index.toString()}
            className={`h-2 data-[state=active]:bg-green-500 rounded-full border-none ${
              index <= currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`}
            disabled
          />
        ))}
      </TabsList>
    </Tabs>
  );
}
