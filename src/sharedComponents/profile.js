import React from 'react'
import classes from './profile.module.scss';
import Avatar from '../pages/chat/components/avatar';

export default function Profile({ name, avatar, users, onContactClick }) {
  return (
    <div className={classes['profile']}>
      <div className={classes['top']}>
        <div className={classes['avatar']}>
          <Avatar url={avatar} />
        </div>
        <div className={classes['name']}>
          {name}
        </div>
      </div>
      <div className={classes['users']}>
        {users.map(user =>
          <div
            key={user.id}
            onClick={() => onContactClick(user)}
          >{user.title}</div>)}
      </div>
    </div>
  )
}
