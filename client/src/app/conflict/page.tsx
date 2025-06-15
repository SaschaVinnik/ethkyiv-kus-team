"use client";

import React from "react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ConnectWalletStep } from "@/components/conflicts/ConnectWalletStep";
import { pinDisputeWithAttachments } from "@/lib/pinata";
import { createDispute } from "@/lib/contract";

export default function App() {
  const [formData, setFormData] = React.useState({
    walletAddress: "",
    counterpartyAddress: "",
    attachments: [] as File[],
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    const walletAddress = formData.walletAddress
    try {
      const { metadataUrl, fileUrls } = await pinDisputeWithAttachments(
        {
          walletAddress: formData.walletAddress,
          counterpartyAddress: formData.counterpartyAddress,
        },
        formData.attachments
      );

      const disputeId = await createDispute(walletAddress, metadataUrl);
      console.log(disputeId);
      
      alert(`Uploaded! Metadata: ${metadataUrl}`);
      console.log("📄 Metadata URL:", metadataUrl);
      console.log("📂 Attachments:", fileUrls);
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f0eee8] p-4 md:p-8">
      <Card className="max-w-3xl mx-auto shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col gap-2 bg-[#eae6dd]">
          <h1 className="text-2xl font-bold text-[#a98d5d]">Submit a Dispute</h1>
          <p className="text-[#a98d5d]">Connect your wallet and upload relevant materials</p>
        </CardHeader>
        <CardBody className="bg-white">
          <ConnectWalletStep data={formData} updateData={updateFormData} />
          <div className="flex justify-end mt-6">
            <Button color="warning" onPress={handleSubmit}>
              Submit
              <Icon icon="lucide:upload" className="ml-2" />
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
