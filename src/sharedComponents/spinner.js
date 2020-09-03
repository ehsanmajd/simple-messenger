import React from 'react';
import styles from './spinner.module.scss'
import { ClockLoader } from 'react-spinners';

export default function Spinner({ loading }) {
  if (!loading) {
    return null;
  }
  return (
    <div className={styles['wrapper']}>
      <div className={styles['spinner-container']}>
        <ClockLoader loading={loading} size='150' color='green' />
      </div>
    </div>
  )
}