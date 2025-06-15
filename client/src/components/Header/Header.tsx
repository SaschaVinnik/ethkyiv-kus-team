'use client'

import { useState } from 'react'
import styles from './Header.module.css'
import Link from 'next/link'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>Verdicto</div>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          <ul className={styles.navList}>
            <li><Link href="/" className={styles.navLink}>Home</Link></li>
            <li><Link href="/conflict" className={styles.navLink}>Dispute</Link></li>
            <li><Link href="/conflicts" className={styles.navLink}>My Disputes</Link></li>
            <li><Link href="/profile" className={styles.navLink}>Profile</Link></li>
          </ul>
        </nav>

        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.bar} ${menuOpen ? styles.bar1 : ''}`}></span>
          <span className={`${styles.bar} ${menuOpen ? styles.bar2 : ''}`}></span>
          <span className={`${styles.bar} ${menuOpen ? styles.bar3 : ''}`}></span>
        </button>
      </div>
    </header>
  )
}
