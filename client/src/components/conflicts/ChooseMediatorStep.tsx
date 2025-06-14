import React from 'react';
import { Input, Card, CardBody, Button, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Mediator {
  id: string;
  name: string;
  expertise: string[];
  rating: number;
  bio: string;
}

interface ChooseMediatorStepProps {
  data: Mediator | null;
  updateData: (data: { selectedMediator: Mediator | null }) => void;
}

const mockMediators: Mediator[] = [
  { id: '1', name: 'Alice Johnson', expertise: ['Contracts', 'Finance'], rating: 4.8, bio: 'Experienced in contract disputes and financial arbitration.' },
  { id: '2', name: 'Bob Smith', expertise: ['Intellectual Property', 'Technology'], rating: 4.6, bio: 'Specializes in tech-related disputes and IP conflicts.' },
  { id: '3', name: 'Carol Williams', expertise: ['Employment', 'Labor Law'], rating: 4.9, bio: 'Expert in resolving workplace and employment disputes.' },
];

export const ChooseMediatorStep: React.FC<ChooseMediatorStepProps> = ({ data, updateData }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedMediator, setSelectedMediator] = React.useState<Mediator | null>(data);

  const filteredMediators = mockMediators.filter(mediator =>
    mediator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mediator.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectMediator = (mediator: Mediator) => {
    setSelectedMediator(mediator);
    updateData({ selectedMediator: mediator });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Step 3: Select a Mediator or Arbitrator</h2>
      <p className="text-gray-600">Choose a neutral, qualified mediator from the platform.</p>
      
      <Input
        label="Search by name or expertise"
        placeholder="e.g., John Doe, Contracts"
        value={searchTerm}
        onValueChange={setSearchTerm}
        startContent={<Icon icon="lucide:search" className="text-default-400" />}
      />
      
      <div className="grid gap-4 mt-4">
        {filteredMediators.map(mediator => (
          <Card key={mediator.id} isPressable onPress={() => handleSelectMediator(mediator)}>
            <CardBody className="flex items-center space-x-4">
              <Avatar
                src={`https://img.heroui.chat/image/avatar?w=128&h=128&u=${mediator.id}`}
                size="lg"
                alt={mediator.name}
              />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{mediator.name}</h3>
                <p className="text-sm text-gray-500">{mediator.expertise.join(', ')}</p>
                <div className="flex items-center mt-1">
                  <Icon icon="lucide:star" className="text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{mediator.rating.toFixed(1)}</span>
                </div>
              </div>
              <Button
                color="primary"
                variant={selectedMediator?.id === mediator.id ? "solid" : "bordered"}
                size="sm"
              >
                {selectedMediator?.id === mediator.id ? 'Selected' : 'Select'}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
      
      {filteredMediators.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No mediators found. Please try a different search term or contact support.
        </p>
      )}
    </div>
  );
};