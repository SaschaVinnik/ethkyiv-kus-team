'use client'

import styles from './CreateButton.module.css';

export default function CreateButton() {
  const handleClick = () => {
    alert('Task creation modal or redirect will go here.');
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      Create Task
    </button>
  );
}
