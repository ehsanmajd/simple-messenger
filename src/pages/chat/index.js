import React, { useMemo, useEffect } from 'react'
import AppStatus from './components/appStatus';
import ListItem from './components/listItem';
import List from './components/list';
import ChatDetail from './components/chatDetail';
import styles from './index.module.scss';
import { newUserRegistered, closeChat, initDataLoaded, loadChatMessages, newMessageReceived } from '../../stateManager/actionCreator';
import { useAppState } from '../../context/appStateContext';
import { useDispatch } from '../../context/dispatcherContext';
import { loadContacts, loadRecentChats, submitTextMessage, getChatMessages } from '../../services/main';
import io from 'socket.io-client';
import { baseUrl } from '../../utility/request';
import moment from 'moment';
import ErrorBoundary from '../../sharedComponents/errorBoundry';

export default function Index() {
  const { userId, chatList, messages, selectedChatId } = useAppState();
  const dispatch = useDispatch();

  const selectedChat = useMemo(
    () => chatList.find(x => x.id === selectedChatId),
    [chatList, selectedChatId]
  );

  const sortedChatList = useMemo(
    () => {
      return chatList
        .slice()
        .sort((a, b) => {
          const lastMessageA = messages.filter(x => x.chatId === a.id);
          const lastMessageB = messages.filter(x => x.chatId === b.id);
          if (!lastMessageA && !lastMessageB) {
            return 0;
          }
          else if (!lastMessageA && lastMessageB) {
            return -1;
          }
          else if (!lastMessageB && lastMessageA) {
            return +1
          }
          else {
            return moment(lastMessageB.time).isBefore(lastMessageA.time) ? 1 : -1
          }
        })
    },
    [chatList, messages]
  )
  const selectedChatMessages = messages.filter(x => x.chatId === selectedChatId);

  function handleChatSelect(id) {
    if (id === selectedChatId) {
      return;
    }
    getChatMessages(id, userId)
      .then(data => {
        dispatch(loadChatMessages(id, data.result));
      })
  }

  function handleSubmit(text) {
    submitTextMessage(userId, selectedChatId, text);
  }

  function handleClose() {
    dispatch(closeChat());
  }

  useEffect(
    () => {
      Promise.all([
        loadContacts(userId),
        loadRecentChats(userId)
      ])
        .then(([contacts, chats]) => {
          dispatch(
            initDataLoaded({
              contacts,
              chats
            })
          );
        })
    },
    [userId, dispatch]
  )

  useEffect(
    () => {
      const socket = io(baseUrl);
      socket.emit('online', userId);

      socket.on('new-user', user => {
        dispatch(newUserRegistered(user))
      });

      socket.on('new-message', data => {
        dispatch(newMessageReceived(data))
      })
    },
    [userId, dispatch]
  )
  
  return (
    <div className={styles['layout']}>
      <div className={styles['side']}>
        <AppStatus />
        <List>
          {sortedChatList.map(chat => {
            const lastMessage = messages.filter(x => x.chatId === chat.id);
            return <ListItem
              selected={chat.id === selectedChatId}
              onSelect={() => handleChatSelect(chat.id)}
              key={chat.id}
              name={chat.name}
              avatar={chat.avatar}
              time={lastMessage.length === 0 ? '' : lastMessage[lastMessage.length - 1].time}
              unreadMessageCount={chat.unreadMessageCount}
              text={lastMessage.length === 0 ? '' : lastMessage[lastMessage.length - 1].text}
            />
          })}
        </List>
      </div>
      <div className={styles['main']}>
        <ErrorBoundary>
          {selectedChatId &&
            <ChatDetail
              onClose={handleClose}
              selectedChatId={selectedChatId}
              onSubmit={handleSubmit}
              avatar={selectedChat.avatar}
              name={selectedChat.name}
              messages={selectedChatMessages.map(message => {
                return {
                  id: message.id,
                  text: message.text,
                  me: message.userId === userId
                }
              })}
            />
          }
        </ErrorBoundary>
      </div>
    </div>
  )
}
