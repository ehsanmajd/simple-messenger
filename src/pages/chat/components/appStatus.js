import React, { useState, useRef, useEffect } from 'react'
import TitleBar from './titleBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import styles from './appStatus.module.scss';
import Profile from '../../../sharedComponents/profile';
import Sidebar from '../../../sharedComponents/sidebar';
import { useAppState } from '../../../context/appStateContext';
import { startChat } from '../../../services/main';
import { useDispatch } from '../../../context/dispatcherContext';
import { chatCreated } from '../../../stateManager/actionCreator';

export default function AppStatus() {
  const [mode, setMode] = useState('list');
  const input = useRef(null);
  const [open, setOpen] = useState(false);
  const { contacts, userId } = useAppState();
  const dispatch = useDispatch();

  function gotoSearchMode() {
    setMode('search');
  }

  function gotoListMode() {
    setMode('list');
  }

  useEffect(
    () => {
      if (mode === 'search') {
        input.current.focus();
      }
    },
    [mode]
  );

  function handleContactClick({ id: peerId, title }) {
    startChat(peerId, userId)
      .then(({ result }) => {
        setOpen(false);
        dispatch(chatCreated(result.id, title));
      })
  }

  const listMode = mode === 'list';

  return (
    <>
      <Sidebar open={open} onClose={() => setOpen(false)}>
        <Profile
          name='Ehsan'
          avatar='./avatar.png'
          users={contacts}
          onContactClick={handleContactClick}
        />
      </Sidebar>
      <TitleBar
        first={<FontAwesomeIcon
          icon={listMode ? faBars : faArrowLeft}
          size='lg'
          color='#009588'
          className={styles['pointer']}
          onClick={() => !open ? setOpen(true) : gotoListMode()}
        />}
        middle={
          <div className={styles['app-title']}>
            {listMode && "Fancy Messenger"}
            {!listMode && <input
              type='text'
              className={styles['search-text']}
              ref={input}
            />}
          </div>
        }
        last={listMode && <FontAwesomeIcon
          icon={faSearch}
          size='lg'
          color='#009588'
          className={styles['pointer']}
          onClick={gotoSearchMode}
        />}
      />
    </>
  )
}
