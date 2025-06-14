'use client'

import React from 'react';
import { Card, CardBody, CardHeader, Progress, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { FactualSummaryStep } from '@/components/conflicts/FactualSummaryStep';
import { DesiredOutcomeStep } from '@/components/conflicts/DesiredOutcomeStep';
import { ChooseMediatorStep } from '@/components/conflicts/ChooseMediatorStep';
import { ReviewSubmitStep } from '@/components/conflicts/ReviewSubmitStep';

const steps = [
  "Factual Summary",
  "Desired Outcome",
  "Choose Mediator",
  "Review & Submit"
];

export default function App() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    factualSummary: { title: '', summary: '', attachments: [] },
    subjectivePosition: '',
    desiredOutcome: { type: '', details: '' },
    selectedMediator: null,
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    // Implement save draft functionality here
    console.log('Saving draft:', formData);
  };

  const updateFormData = React.useCallback((stepData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <FactualSummaryStep data={formData.factualSummary} updateData={updateFormData} />;
      case 1:
        return <DesiredOutcomeStep data={formData.desiredOutcome} updateData={updateFormData} />;
      case 2:
        return <ChooseMediatorStep data={formData.selectedMediator} updateData={updateFormData} />;
      case 3:
        return <ReviewSubmitStep data={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0eee8] p-4 md:p-8">
      <Card className="max-w-4xl mx-auto shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col gap-2 bg-[#eae6dd]">
          <h1 className="text-2xl font-bold text-[#a98d5d]">Submit a Dispute</h1>
          <Progress
            aria-label="Dispute submission progress"
            value={(currentStep + 1) * 20}
            className="max-w-md"
            color="warning"
          />
          <p className="text-[#a98d5d]">Step {currentStep + 1} of {steps.length}: {steps[currentStep]}</p>
        </CardHeader>
        <CardBody className="bg-white">
          {renderStep()}
          <div className="flex justify-between mt-6">
            <Button
              color="warning"
              variant="flat"
              onPress={handleBack}
              isDisabled={currentStep === 0}
            >
              <Icon icon="lucide:arrow-left" className="mr-2" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button color="warning" variant="flat" onPress={handleSaveDraft}>
                <Icon icon="lucide:save" className="mr-2" />
                Save Draft
              </Button>
              <Button color="warning" onPress={handleNext} isDisabled={currentStep === steps.length - 1}>
                {currentStep < steps.length - 1 ? (
                  <>
                    Next: {steps[currentStep + 1]}
                    <Icon icon="lucide:arrow-right" className="ml-2" />
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}