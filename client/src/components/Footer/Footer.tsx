import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>© 2025 Verdicto. All rights reserved.</p>
        <nav className={styles.nav}>
          <a href="/about" className={styles.link}>About Us</a>
          <a href="/terms" className={styles.link}>Terms of Service</a>
          <a href="/privacy" className={styles.link}>Privacy Policy</a>
          <a href="/contact" className={styles.link}>Contact</a>
        </nav>
      </div>
    </footer>
  );
}
