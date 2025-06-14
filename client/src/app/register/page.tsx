'use client'

import styles from './page.module.css'
import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import WalletConnectButton from '@/components/WalletConnectButton/WalletConnectButton'

interface RegisterPageProps {
  initialRole: 'conflict' | 'mediator' // теперь роль приходит сразу, без выбора на месте
}

export default function RegisterPage({ initialRole }: RegisterPageProps) {
  const [role] = useState<'conflict' | 'mediator'>('conflict')

  return (
    <div className={styles.container}>
      <div className={styles.overlay}>
        {role === 'conflict' && (
          <form className={styles.form}>
            <h2 className={styles.title}>Conflict Registration</h2>

            <div className={styles.formGroup}>
              <input
                id="conflictName"
                className={styles.input}
                type="text"
                placeholder="Your Name"
                required
              />
              <label htmlFor="conflictName" className={styles.label}>Your Name</label>
            </div>

            <ConnectButton />
          </form>
        )}

        {role === 'mediator' && (
          <form className={styles.form}>
            <h2 className={styles.title}>Mediator Application</h2>

            <div className={styles.formGroup}>
              <input
                id="mediatorName"
                className={styles.input}
                type="text"
                placeholder="Full Name"
                required
              />
              <label htmlFor="mediatorName" className={styles.label}>Full Name</label>
            </div>

            <div className={styles.formGroup}>
              <input
                id="mediatorEmail"
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                required
              />
              <label htmlFor="mediatorEmail" className={styles.label}>Email</label>
            </div>

            <div className={styles.formGroup}>
              <textarea
                id="experienceSummary"
                className={styles.textarea}
                placeholder="Tell us about your background..."
                rows={4}
                required
              />
              <label htmlFor="experienceSummary" className={styles.label}>Experience Summary</label>
            </div>

            <div className={styles.formGroup}>
              <input
                id="portfolio"
                className={styles.input}
                type="url"
                placeholder="https://linkedin.com/in/you"
              />
              <label htmlFor="portfolio" className={styles.label}>Portfolio / LinkedIn</label>
            </div>

            <WalletConnectButton />
          </form>
        )}
      </div>
    </div>
  )
}
