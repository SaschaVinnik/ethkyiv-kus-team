import React from 'react';
import styles from './ConflictCard.module.css';

type ConflictCardProps = {
  conflictId: string;
  partyA: string;
  partyB: string;
  description: string;
  mentor?: string | null;
  status: 'open' | 'pending' | 'assigned' | 'closed';
  onViewDetails: (id: string) => void;
};

export default function ConflictCard({
  conflictId,
  partyA,
  partyB,
  description,
  mentor,
  status,
  onViewDetails,
}: ConflictCardProps) {
  const statusLabels: Record<string, string> = {
    open: 'Open',
    pending: 'Waiting for Mediator',
    assigned: 'Mentor Assigned',
    closed: 'Closed',
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Conflict between {partyA} and {partyB}</h3>

      <p className={styles.description}>{description}</p>

      <div className={styles.infoRow}>
        <strong>Status: </strong>
        <span>{statusLabels[status]}</span>
      </div>

      <div className={styles.infoRow}>
        <strong>Mentor: </strong>
        <span>{mentor ?? 'No mentor assigned'}</span>
      </div>

      <button
        className={styles.detailsButton}
        onClick={() => onViewDetails(conflictId)}
      >
        View Details
      </button>
    </div>
  );
}
