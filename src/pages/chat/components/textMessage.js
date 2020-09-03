import React, { forwardRef } from 'react';
import moment from 'moment';
import styles from './textMessage.module.scss';

export default forwardRef(({ me, text, time }, ref) => {
  return (
    <li
      ref={ref}
      className={styles[me ? 'me' : '']}
    >
      {text}
      <div className='time'>{moment(time).format('hh:mm')}</div>
    </li>
  )
});