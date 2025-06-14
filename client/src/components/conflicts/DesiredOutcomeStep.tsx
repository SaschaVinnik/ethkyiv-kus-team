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
      <h2 className="text-xl font-semibold text-gray-800">Step 2: Desired Outcome</h2>
      <p className="text-gray-600">Choose what resolution you seek.</p>
      
      <RadioGroup
        label="Desired Outcome Type"
        value={outcomeType}
        onValueChange={setOutcomeType}
      >
        <Radio value="monetary">Monetary Compensation</Radio>
        <Radio value="apology">Apology or Statement</Radio>
        <Radio value="action">Specific Action</Radio>
        <Radio value="other">Other</Radio>
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
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
      )}
      
      {(outcomeType === 'action' || outcomeType === 'other' || outcomeType === 'apology') && (
        <Textarea
          label="Describe Desired Action"
          placeholder="e.g., refund shipping fees, fix defect..."
          value={details}
          onValueChange={setDetails}
          minRows={3}
        />
      )}
      
      <p className="text-sm text-gray-500">
        If selecting Monetary Compensation, specify the amount. For other outcomes, provide clear details.
      </p>
    </div>
  );
};