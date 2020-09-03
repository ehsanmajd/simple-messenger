import React, { useState, useRef, useEffect } from 'react'
import TitleBar from './titleBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faTimes, faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import Avatar from './avatar';
import styles from './chatDetail.module.scss';
import { getChatMessages } from '../../../services/main';
import { useDispatch } from '../../../context/dispatcherContext';
import { useAppState } from '../../../context/appStateContext';
import { prependChatMessages } from '../../../stateManager/actionCreator';
import TextMessage from './textMessage';
import Spinner from '../../../sharedComponents/spinner';

export default function ChatDetail(
  {
    name,
    messages,
    avatar,
    onSubmit,
    selectedChatId,
    onClose,
    loading
  }
) {
  const [text, setText] = useState('');
  const lastMessage = useRef('');
  const input = useRef(null);
  const lastEmptyMessage = useRef(null);
  const messageContainer = useRef(null);
  const dispatch = useDispatch();
  const { userId } = useAppState();

  function handleSubmitMessage() {
    if (text !== '') {
      onSubmit(text);
      setText('');
      lastMessage.current = text;
      input.current.focus();
    }
  }

  function handleKeyUp(e) {
    if (e.keyCode === 13) {
      handleSubmitMessage();
    }
  }

  useEffect(
    () => {
      function handleScroll() {
        if (messageContainer.current.scrollTop === 0) {
          getChatMessages(selectedChatId, userId, messages[messages.length - 1].id)
            .then(data => {
              dispatch(prependChatMessages(selectedChatId, data.result));
            })
        }
      }
      const msgContainer = messageContainer.current;
      msgContainer.addEventListener('scroll', handleScroll);
      return () => {
        msgContainer.removeEventListener('scroll', handleScroll);
      }
    },
    [selectedChatId, messages, userId, dispatch]
  )

  useEffect(
    () => {
      if (lastEmptyMessage.current && messages.length > 0) {
        if (messages[messages.length - 1].text === lastMessage.current) {
          lastEmptyMessage.current.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    [messages]
  );

  useEffect(
    () => {
      input.current.focus();
      if (lastEmptyMessage.current) {
        lastEmptyMessage.current.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [selectedChatId]
  )

  return (
    <>
      
      <TitleBar
        first={<FontAwesomeIcon onClick={onClose} icon={faTimes} size='lg' color='#009588' className='pointer' />}
        middle={
          <div className={styles['app-title']}>
            <Avatar name={name} url={avatar} />
            <div className={styles['name']}>{name}</div>
          </div>
        }
        last={<FontAwesomeIcon icon={faEllipsisV} size='lg' color='#009588' className='pointer' />}
      />
      <div className={styles['chat-box']}>
        <Spinner loading={loading} />
        <ul className={styles['messages-panel']} ref={messageContainer}>
          {
            messages.map((message, index) => {
              
              return <TextMessage
                time={message.time}
                ref={messages.length === index + 1 ? lastEmptyMessage : null}
                me={message.me}
                text={message.text}
                key={message.id}
              />
            })
          }
        </ul>
        <div className={styles['input-section']}>
          <input
            ref={input}
            type='text'
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyUp={handleKeyUp}
          />
          <FontAwesomeIcon
            onClick={handleSubmitMessage}
            icon={text !== '' ? faPaperPlane : faPaperclip}
            color='#009588'
            className={styles['send'] + ' ' + styles['pointer']}
            size='lg'
          />
        </div>
      </div>
    </>
  )
}
