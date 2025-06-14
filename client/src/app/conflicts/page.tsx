'use client';

import React from 'react';
import ConflictCard from '@/components/ConflictCard/ConflictCard';
import styles from './page.module.css';

const conflictsData = [
  {
    conflictId: '1',
    partyA: 'Anna',
    partyB: 'Ivan',
    description: 'Dispute over shared apartment use after lease termination.',
    mentor: null,
    status: 'open',
  },
  {
    conflictId: '2',
    partyA: 'Maria',
    partyB: 'Peter',
    description: 'Misunderstanding in business partnership over financial obligations.',
    mentor: 'Oleg Smirnov',
    status: 'assigned',
  },
  {
    conflictId: '3',
    partyA: 'Svetlana',
    partyB: 'Dmitry',
    description: 'Conflict regarding service contract terms.',
    mentor: null,
    status: 'pending',
  },
  {
    conflictId: '4',
    partyA: 'Olga',
    partyB: 'Nikolay',
    description: 'Dispute over intellectual property rights.',
    mentor: 'Ekaterina Ivanova',
    status: 'assigned',
  },
  {
    conflictId: '5',
    partyA: 'Elena',
    partyB: 'Alexey',
    description: 'Disagreement about property division after divorce.',
    mentor: null,
    status: 'open',
  },
];

export default function ConflictsPage() {
  const handleViewDetails = (id: string) => {
    alert(`Navigate to conflict details with ID: ${id}`);
    // Replace alert with router navigation e.g.
    // router.push(`/conflicts/${id}`)
  };

  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>Open Conflicts</h1>

      {conflictsData.map(conflict => (
        <ConflictCard
          key={conflict.conflictId}
          conflictId={conflict.conflictId}
          partyA={conflict.partyA}
          partyB={conflict.partyB}
          description={conflict.description}
          mentor={conflict.mentor}
          status={conflict.status as any}
          onViewDetails={handleViewDetails}
        />
      ))}
    </div>
  );
}
