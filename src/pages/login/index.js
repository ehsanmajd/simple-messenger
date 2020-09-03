import React, { useState, useEffect } from 'react';
import { signIn } from '../../services/main';
import { useDispatch } from '../../context/dispatcherContext';
import { userSingedIn } from '../../stateManager/actionCreator';
import { useAppState } from '../../context/appStateContext';
import { useHistory } from 'react-router-dom';

export default function Index() {
  const [name, setName] = useState('');
  const { userId } = useAppState();
  const history = useHistory();
  const dispatch = useDispatch();

  function handleSignIn() {
    // TODO: validate `name` first.
    signIn(name)
      .then(({ success, result: user }) => {
        if (success) {
          localStorage.setItem('userId', user.id)
          localStorage.setItem('username', user.name)
          dispatch(userSingedIn(user))
        }
      })
  }

  useEffect(
    () => {
      if (userId) {
        history.push('/chat');
      }
    },
    [userId, history]
  )

  
  return (
    <div>
      <input type='text' value={name} onChange={e => setName(e.target.value)} />
      <button onClick={handleSignIn}>Sign in</button>
    </div>
  )
}