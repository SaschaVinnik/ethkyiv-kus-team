'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import ConflictCard from '@/components/ConflictCard/ConflictCard';
import styles from './page.module.css';
import { getDisputes } from '../services/verdicto.api.service'; // путь уточни, если другой

type ApiDispute = {
  id: number;
  address1: string;
  address2: string;
  createdAt: number;
  updatedAt: number;
  mediatorAddress: string | null;
};

export default function ConflictsPage() {
  const { address } = useAccount();
  const [disputes, setDisputes] = useState<ApiDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleViewDetails = (id: string) => {
    alert(`Navigate to conflict details with ID: ${id}`);
    // router.push(`/conflicts/${id}`);
  };

  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      try {
        const data = await getDisputes(address);
        setDisputes(Array.isArray(data) ? data : [data]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch disputes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>My Conflicts</h1>

      {!address && <p className={styles.infoText}>Please connect your wallet to view disputes.</p>}

      {loading && <p className={styles.infoText}>Loading conflicts...</p>}

      {error && <p className={styles.errorText}>❌ {error}</p>}

      {!loading && !error && disputes.length === 0 && (
        <p className={styles.infoText}>No disputes found.</p>
      )}

      {disputes.map((dispute) => (
        <ConflictCard
          key={dispute.id}
          conflictId={dispute.id.toString()}
          partyA={dispute.address1}
          partyB={dispute.address2}
          description="No description provided." // можно позже заменить на настоящее поле
          mentor={dispute.mediatorAddress || null}
          status={dispute.mediatorAddress ? 'assigned' : 'open'}
          walletAddress={address!}
        />
      ))}
    </div>
  );
}
