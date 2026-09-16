import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const options = [
  { label: "C25 (Oakter)", value: "BROAKTRC25" },
];

const BranchSelector: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>(
    options[0].value
  );

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    localStorage.setItem("company-branch", value);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600">Branch:</span>
      <Select value={selectedBranch} onValueChange={handleBranchChange}>
        <SelectTrigger className="w-[300px] bg-gray-200 focus-visible:bg-white focus-visible:shadow-zinc-400">
          <SelectValue placeholder="Select a branch" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BranchSelector;
