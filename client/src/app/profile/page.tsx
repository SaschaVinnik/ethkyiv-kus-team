'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import styles from './page.module.css';

type Role = 'conflict' | 'mediator';

type UserData = {
  role: Role;
  name: string;
  email?: string;
  experience?: string;
  portfolio?: string;
  conflictDescription?: string;
  avatarUrl?: string;
};

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    // Пример для медиатора
    const exampleUser: UserData = {
      role: 'mediator',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      experience: '5 years in conflict resolution and law.',
      portfolio: 'https://linkedin.com/in/janesmith',
      avatarUrl: 'https://i.pravatar.cc/150?img=32', // пример аватара
    };

    // Пример для конфликта (раскомментировать, чтобы протестировать)
    /*
    const exampleUser: UserData = {
      role: 'conflict',
      name: 'John Doe',
      conflictDescription: 'Dispute with landlord over rent payments.',
    };
    */

    setUserData(exampleUser);
  }, []);

  if (!userData) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.profileContainer}>
        <h1 className={styles.title}>User Profile</h1>

        {userData.role === 'mediator' && userData.avatarUrl && (
          <div className={styles.avatarWrapper}>
            <img
              src={userData.avatarUrl}
              alt={`${userData.name}'s avatar`}
              className={styles.avatarImage}
            />
          </div>
        )}

        <div className={styles.infoBlock}>
          <strong>Name:</strong> {userData.name}
        </div>

        <div className={styles.infoBlock}>
          <strong>Wallet Address:</strong> {address ?? 'Not connected'}
        </div>

        {userData.role === 'conflict' && (
          <>
            <div className={styles.infoBlock}>
              <strong>Conflict Description:</strong>
              <p>{userData.conflictDescription || 'No description provided.'}</p>
            </div>
            <button className={styles.primaryButton}>Create New Conflict</button>
          </>
        )}

        {userData.role === 'mediator' && (
          <>
            <div className={styles.infoBlock}>
              <strong>Email:</strong> {userData.email}
            </div>
            <div className={styles.infoBlock}>
              <strong>Experience:</strong>
              <p>{userData.experience}</p>
            </div>
            <div className={styles.infoBlock}>
              <strong>Portfolio / LinkedIn:</strong>{' '}
              <a href={userData.portfolio} target="_blank" rel="noopener noreferrer">
                {userData.portfolio}
              </a>
            </div>
            <button className={styles.primaryButton}>Apply for New Mediation</button>
          </>
        )}
      </div>
    </div>
  );
}
