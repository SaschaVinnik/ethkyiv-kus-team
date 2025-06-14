import React from 'react';
import { RadioGroup, Radio, Input, Textarea } from "@heroui/react";

interface DesiredOutcomeData {
  type: string;
  details: string;
}

interface DesiredOutcomeStepProps {
  data: DesiredOutcomeData;
  updateData: (data: { desiredOutcome: DesiredOutcomeData }) => void;
}

export const DesiredOutcomeStep: React.FC<DesiredOutcomeStepProps> = ({ data, updateData }) => {
  const [outcomeType, setOutcomeType] = React.useState(data.type);
  const [details, setDetails] = React.useState(data.details);

  React.useEffect(() => {
    updateData({ desiredOutcome: { type: outcomeType, details } });
  }, [outcomeType, details, updateData]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#a98d5d]">Step 2: Desired Outcome</h2>
      <p className="text-[#a98d5d]">Choose what resolution you seek.</p>
      
      <RadioGroup
        label="Desired Outcome Type"
        value={outcomeType}
        onValueChange={setOutcomeType}
        classNames={{
          label: "text-[#a98d5d]",
          wrapper: "bg-[#ece9e1] p-4 rounded-2xl",
        }}
      >
        {["monetary", "apology", "action", "other"].map((type) => (
          <Radio
            key={type}
            value={type}
            className={`${
              outcomeType === type
                ? "border-2 border-[#a98d5d] bg-[#eae6dd] font-semibold"
                : "border border-[#ddd3c4]"
            } rounded-xl p-3 transition-all duration-200`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Radio>
        ))}
      </RadioGroup>
      
      {outcomeType === 'monetary' && (
        <Input
          type="number"
          label="Compensation Amount (USD)"
          placeholder="e.g., 1000.00"
          value={details}
          onValueChange={setDetails}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-[#a98d5d] text-small">$</span>
            </div>
          }
          classNames={{
            label: "text-[#a98d5d]",
            input: "bg-white border-[#ddd3c4] focus:border-[#a98d5d] focus:ring-[#a98d5d]",
          }}
        />
      )}
      
      {(outcomeType === 'action' || outcomeType === 'other' || outcomeType === 'apology') && (
        <Textarea
          label="Describe Desired Action"
          placeholder="e.g., refund shipping fees, fix defect..."
          value={details}
          onValueChange={setDetails}
          minRows={3}
          classNames={{
            label: "text-[#a98d5d]",
            input: "bg-white border-[#ddd3c4] focus:border-[#a98d5d] focus:ring-[#a98d5d]",
          }}
        />
      )}
      
      <p className="text-sm text-[#a98d5d]">
        If selecting Monetary Compensation, specify the amount. For other outcomes, provide clear details.
      </p>
    </div>
  );
};