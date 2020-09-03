import React from 'react';
import styles from './app.module.scss'

export default function Index({ route, component }) {

  return (
    <div className={styles['app']}>
      <div className={styles['head']} />
      <div className={styles['main']}>
        {React.createElement(component, { route })}
      </div>
    </div>
  );
}