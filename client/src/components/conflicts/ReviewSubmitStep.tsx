import React from 'react';
import { Card, CardBody, Button, Checkbox } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ReviewSubmitStepProps {
  data: {
    factualSummary: { title: string; summary: string; attachments: File[] };
    desiredOutcome: { type: string; details: string };
    selectedMediator: { name: string; expertise: string[] } | null;
  };
}

export const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ data }) => {
  const [termsAccepted, setTermsAccepted] = React.useState(false);

  const handleSubmit = () => {
    if (termsAccepted) {
      console.log('Submitting dispute:', data);
      // Implement actual submission logic here
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Step 4: Review & Submit</h2>
      <p className="text-gray-600">Verify all details before submitting your dispute.</p>

      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold mb-2">Factual Summary</h3>
          <p className="text-gray-700 mb-2"><strong>Title:</strong> {data.factualSummary.title}</p>
          <p className="text-gray-700 mb-2"><strong>Summary:</strong> {data.factualSummary.summary}</p>
          <p className="text-gray-700 mb-2">
            <strong>Attachments:</strong> {data.factualSummary.attachments.length} file(s)
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold mb-2">Desired Outcome</h3>
          <p className="text-gray-700 mb-2"><strong>Type:</strong> {data.desiredOutcome.type}</p>
          <p className="text-gray-700 mb-2"><strong>Details:</strong> {data.desiredOutcome.details}</p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold mb-2">Selected Mediator</h3>
          {data.selectedMediator ? (
            <>
              <p className="text-gray-700 mb-2"><strong>Name:</strong> {data.selectedMediator.name}</p>
              <p className="text-gray-700 mb-2"><strong>Expertise:</strong> {data.selectedMediator.expertise.join(', ')}</p>
            </>
          ) : (
            <p className="text-gray-700">No mediator selected</p>
          )}
        </CardBody>
      </Card>

      <Checkbox
        isSelected={termsAccepted}
        onValueChange={setTermsAccepted}
      >
        I agree to the <a href="#" className="text-primary-500 hover:underline">Terms & Conditions</a>
      </Checkbox>

      <Button
        color="primary"
        size="lg"
        onPress={handleSubmit}
        isDisabled={!termsAccepted}
        className="w-full"
      >
        Submit Dispute
        <Icon icon="lucide:send" className="ml-2" />
      </Button>
    </div>
  );
};