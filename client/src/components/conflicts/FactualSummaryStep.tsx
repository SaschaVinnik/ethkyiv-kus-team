"use client";

import React from "react";
import { Input, Textarea, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface FactualSummaryData {
  title: string;
  summary: string;
  attachments: File[];
}

interface FactualSummaryStepProps {
  data: FactualSummaryData;
  updateData: (data: { factualSummary: FactualSummaryData }) => void;
}

export const FactualSummaryStep: React.FC<FactualSummaryStepProps> = ({
  data,
  updateData,
}) => {
  const [title, setTitle] = React.useState(data.title);
  const [summary, setSummary] = React.useState(data.summary);
  const [attachments, setAttachments] = React.useState<File[]>(
    data.attachments
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  React.useEffect(() => {
    updateData({ factualSummary: { title, summary, attachments } });
  }, [title, summary, attachments, updateData]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#a98d5d]">
        Step 1: Factual Summary
      </h2>
      <p className="text-[#a98d5d]">
        Provide a neutral, objective description of the dispute facts without
        opinions.
      </p>

      <Input
        label="Dispute Title"
        placeholder="Short descriptive title"
        value={title}
        onValueChange={setTitle}
        isRequired
        classNames={{
          label: "text-[#a98d5d]",
          input:
            "bg-white border-[#ddd3c4] focus:border-[#a98d5d] focus:ring-[#a98d5d]",
        }}
      />

      <Textarea
        label="Fabula (Factual Summary)"
        placeholder="Describe the key facts neutrally…"
        value={summary}
        onValueChange={setSummary}
        isRequired
        minRows={4}
        classNames={{
          label: "text-[#a98d5d]",
          input:
            "bg-white border-[#ddd3c4] focus:border-[#a98d5d] focus:ring-[#a98d5d]",
        }}
      />

      <div>
        <label className="block text-sm font-medium text-[#a98d5d] mb-2">
          Attachments (optional)
        </label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-[#ddd3c4] border-dashed rounded-2xl cursor-pointer bg-[#ece9e1] hover:bg-[#eae6dd]"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Icon
                icon="lucide:upload"
                className="w-10 h-10 mb-3 text-[#a98d5d]"
              />
              <p className="mb-2 text-sm text-[#a98d5d]">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-[#a98d5d]">
                PDF, DOCX, JPG, PNG, MP4 (MAX. 10MB)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
          </label>
        </div>
      </div>

      {attachments.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-[#a98d5d] mb-2">
            Uploaded Files
          </h3>
          <ul className="divide-y divide-[#ddd3c4]">
            {attachments.map((file, index) => (
              <li
                key={index}
                className="py-3 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <Icon
                    icon="lucide:file"
                    className="w-5 h-5 mr-3 text-[#a98d5d]"
                  />
                  <span className="text-sm font-medium text-[#a98d5d]">
                    {file.name}
                  </span>
                </div>
                <Button
                  color="warning"
                  variant="light"
                  size="sm"
                  isIconOnly
                  onPress={() => handleRemoveFile(index)}
                >
                  <Icon icon="lucide:x" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
