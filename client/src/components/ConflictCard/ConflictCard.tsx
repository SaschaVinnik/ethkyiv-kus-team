import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import styles from './ConflictCard.module.css';
import { depositFunds, confirmMediator, resolveDispute } from '@/lib/contract'; // Пусть функции лежат здесь
import { pinDisputeWithAttachments } from '@/lib/pinata';

type ConflictCardProps = {
  conflictId: string;
  partyA: string;
  partyB: string;
  description: string;
  mentor?: string | null;
  status: 'open' | 'pending' | 'assigned' | 'closed';
  walletAddress: string; // текущий адрес пользователя
};

export default function ConflictCard({
  conflictId,
  partyA,
  partyB,
  description,
  mentor,
  status,
  walletAddress
}: ConflictCardProps) {
  const [loadingPay, setLoadingPay] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successPay, setSuccessPay] = useState(false);
  const [successConfirm, setSuccessConfirm] = useState(false);
  const [mediatorAddress, setMediatorAddress] = useState('');
  const [attachments, setAttachments] = React.useState<File[]>([]);

  

  const statusLabels: Record<string, string> = {
    open: 'Open',
    pending: 'Waiting for Mediator',
    assigned: 'Mentor Assigned',
    closed: 'Closed',
  };

  // Проверяем, совпадает ли кошелек с участниками (partyA или partyB)
  const canPay =
    walletAddress.toLowerCase() === partyA.toLowerCase() ||
    walletAddress.toLowerCase() === partyB.toLowerCase();

  const isMentor = mentor && walletAddress.toLowerCase() === mentor.toLowerCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  }; 
  
  const handleRemoveFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handlePayClick = async () => {
    setLoadingPay(true);
    setError(null);
    setSuccessPay(false);
    try {
      const disputeIdNum = parseInt(conflictId, 10);
      const amountToPay = 1000000; // Здесь укажи сумму для оплаты

      await depositFunds(disputeIdNum, amountToPay);
      setSuccessPay(true);
    } catch (e) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoadingPay(false);
    }
  };

  const handleConfirmMediatorClick = async () => {
    if (!mediatorAddress.trim()) {
      setError('Please enter a mediator address.');
      return;
    }
    setLoadingConfirm(true);
    setError(null);
    setSuccessConfirm(false);
    try {
      const disputeIdNum = parseInt(conflictId, 10);
      await confirmMediator(disputeIdNum, mediatorAddress.trim());
      setSuccessConfirm(true);
    } catch (e) {
      setError('Mediator confirmation failed. Please try again.');
    } finally {
      setLoadingConfirm(false);
    }
  };

  const handleResolveClick = async () => {
    if (attachments.length === 0) {
      setError('Please upload at least one attachment before resolving.');
      return;
    }

    setLoadingConfirm(true);  // Можно использовать loadingConfirm или отдельный стейт
    setError(null);
    setSuccessConfirm(false);

    try {
      // Формируем объект с информацией о разрешении конфликта
      // Можно добавить дополнительное поле с комментарием или описанием решения, если нужно
      const resolutionData = {
        resolvedBy: mentor ?? 'unknown',
        resolvedAt: new Date().toISOString(),
        description: 'Conflict resolved by mentor',
      };

      // Загружаем на IPFS описание и файлы вложений
      const { metadataUrl } = await pinDisputeWithAttachments(
        resolutionData,
        attachments
      );

      const disputeIdNum = parseInt(conflictId, 10);

      // Вызываем метод смартконтракта
      await resolveDispute(disputeIdNum, metadataUrl);

      setSuccessConfirm(true);
      alert('Dispute resolved successfully!');
    } catch (e) {
      console.error(e);
      setError('Failed to resolve dispute. Please try again.');
    } finally {
      setLoadingConfirm(false);
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        Conflict between {partyA} and {partyB}
      </h3>

      <p className={styles.description}>{description}</p>

      <div className={styles.infoRow}>
        <strong>Status: </strong>
        <span>{statusLabels[status]}</span>
      </div>

      <div className={styles.infoRow}>
        <strong>Mentor: </strong>
        <span>{mentor ?? 'No mentor assigned'}</span>
      </div>

      {isMentor && (
        <div>
          <label className="block text-sm font-medium text-[#a98d5d] mb-2">
            Attachments
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

          <button
            className={styles.detailsButton}
            style={{marginTop: '10px'}}
            onClick={handleResolveClick}
            disabled={attachments.length === 0}
            title="Resolve conflict"
          >
            Resolve
          </button>
        </div>
      )}

      <div
        className={styles.buttonGroup}
        style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}
      >

        {canPay && (
          <button
            className={styles.detailsButton}
            onClick={handlePayClick}
            disabled={loadingPay || successPay}
            title="Pay your share"
          >
            {loadingPay
              ? 'Processing...'
              : successPay
              ? 'Paid'
              : 'Pay Your Share'}
          </button>
        )}
      </div>

      {canPay && (
        <div style={{ marginTop: '1rem' }}>
          <label
            htmlFor={`mediator-${conflictId}`}
            style={{
              display: 'block',
              marginBottom: '0.3rem',
              color: '#a98d5d',
              fontWeight: '600',
            }}
          >
            Enter mediator wallet address:
          </label>
          <input
            id={`mediator-${conflictId}`}
            type="text"
            value={mediatorAddress}
            onChange={(e) => setMediatorAddress(e.target.value)}
            placeholder="0x..."
            style={{
              width: '100%',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #a98d5d',
              fontSize: '1rem',
              color: '#1a1a1a',
              boxSizing: 'border-box',
            }}
          />
          <button
            className={styles.detailsButton}
            onClick={handleConfirmMediatorClick}
            disabled={loadingConfirm || successConfirm || !mediatorAddress.trim()}
            style={{ marginTop: '0.7rem' }}
            title="Confirm mediator"
          >
            {loadingConfirm
              ? 'Confirming...'
              : successConfirm
              ? 'Mediator Confirmed'
              : 'Confirm Mediator'}
          </button>
        </div>
      )}

      {error && (
        <p style={{ color: 'red', marginTop: '0.5rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}
