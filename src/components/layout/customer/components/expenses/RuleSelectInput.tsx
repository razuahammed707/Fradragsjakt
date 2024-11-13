import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RuleType } from './ApplyRuleModalContent';

interface RuleSelectInputProps {
  rules: RuleType[];
  onChange: (value: string) => void;
  selectedInput: string;
}
const RuleSelectInput = ({
  rules,
  onChange,
  selectedInput,
}: RuleSelectInputProps) => {
  return (
    <Select value={selectedInput} onValueChange={onChange}>
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="Select a Rule" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {rules?.map((rule) => (
            <SelectItem key={rule._id} value={rule?.description_contains}>
              {rule?.description_contains}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default RuleSelectInput;
