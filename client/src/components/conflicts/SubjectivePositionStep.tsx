import React from 'react';
import { Textarea } from "@heroui/react";

interface SubjectivePositionStepProps {
  data: string;
  updateData: (data: { subjectivePosition: string }) => void;
}

export const SubjectivePositionStep: React.FC<SubjectivePositionStepProps> = ({ data, updateData }) => {
  const [position, setPosition] = React.useState(data);

  React.useEffect(() => {
    updateData({ subjectivePosition: position });
  }, [position, updateData]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Step 2: Subjective Position</h2>
      <p className="text-gray-600">Describe your personal viewpoint and interpretation.</p>
      
      <Textarea
        label="Subjective Position"
        placeholder="Explain how you perceive the situation, your feelings..."
        value={position}
        onValueChange={setPosition}
        isRequired
        minRows={6}
      />
    </div>
  );
};