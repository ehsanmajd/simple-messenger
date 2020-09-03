import { ACTIONS } from './actionCreator'
export const INIT_STATE = {
  name: '',
  userId: null,
  chatList: [
  ],
  messages: [
  ],
  selectedChatId: null,
  contacts: [],
  loading: false,
  waitingForMessages: false
}

// `chat/start/user/{userId}`

export function reducer(state, action) {
  return (ACTION_HANDLERS[action.type] || (() => state))(state, action.payload)
}

const ACTION_HANDLERS = {
  [ACTIONS.CHAT_SELECTED]: handleChatSelected,
  [ACTIONS.MESSAGE_SUBMITTED]: handleMessageSubmitted,
  [ACTIONS.CHAT_CLOSED]: handleChatClosed,
  [ACTIONS.USER_SIGNED_IN]: handleSignIn,
  [ACTIONS.CONTACTS_LOADED]: handleContactsLoaded,
  [ACTIONS.CHATS_LOADED]: handleChatsLoaded,
  [ACTIONS.INIT_DATA_LOADED]: handleInitDataLoaded,
  [ACTIONS.CHAT_CREATED]: handleChatCreated,
  [ACTIONS.CHAT_MESSAGES_LOADED]: handleLoadChatMessages,
  [ACTIONS.CHAT_MESSAGES_PREPENDED]: handleChatMessagePrepended,
  [ACTIONS.NEW_USER_REGISTERED]: handleNewUserRegistered,
  [ACTIONS.NEW_MESSAGE_RECEIVED]: handleNewMessageReceived,
  [ACTIONS.LOADING]: handleLoading,
  [ACTIONS.WAITING_FOR_MESSAGE]: handleWaitingForMessage,
}

function handleChatSelected(state, payload) {
  const selectedChatIndex = state.chatList.findIndex(x => x.id === payload);
  return {
    ...state,
    selectedChatId: payload,
    chatList: [
      ...state.chatList.slice(0, selectedChatIndex),
      {
        ...state.chatList[selectedChatIndex],
        unreadMessageCount: 0
      },
      ...state.chatList.slice(selectedChatIndex + 1)
    ]
  }
}

function handleMessageSubmitted(state, payload) {
  return {
    ...state,
    messages: [
      ...state.messages,
      {
        chatId: state.selectedChatId,
        id: Math.random().toString(),
        text: payload,
        userId: state.userId
      }
    ]
  }
}

function handleChatClosed(state) {
  return {
    ...state,
    selectedChatId: null
  }
}

function handleSignIn(state, payload) {
  return {
    ...state,
    name: payload.name,
    userId: payload.id
  };
}

function handleContactsLoaded(state, payload) {
  return {
    ...state,
    contacts: payload
  }
}

function handleChatsLoaded(state, payload) {
  return {
    ...state,
    chatList: payload
  }
}

function handleInitDataLoaded(state, payload) {
  const messages = [...state.messages];
  payload.chats.forEach(chat => {
    if (chat.lastMessage) {
      messages.push({
        chatId: chat.id,
        id: chat.lastMessage.id,
        text: chat.lastMessage.content,
        userId: chat.lastMessage.userId,
        time: chat.lastMessage.date
      });
    }
  })
  return {
    ...state,
    chatList: payload.chats.map(item => (
      {
        ...item,
        avatar: '/avatar.png',
        time: item.lastMessage ? item.lastMessage.date : null
      }
    )),
    contacts: payload.contacts.filter(item =>
      item.id !== state.userId),
    messages,
    loading: false
  }
}

function handleChatCreated(state, { chatId, name }) {
  let newChatList = state.chatList;
  if (!state.chatList.some(x => x.id === chatId)) {
    const newChat = {
      time: '',
      unreadMessageCount: 0,
      avatar: '/avatar.png',
      id: chatId,
      name
    };
    newChatList = [newChat, ...state.chatList]
  }
  return {
    ...state,
    selectedChatId: chatId,
    chatList: newChatList
  }
}

function handleLoadChatMessages(state, { chatId, data }) {
  const newChatList = [...state.chatList]
  const index = state.chatList.findIndex(x => x.id === chatId);
  newChatList.splice(
    index,
    1,
    {
      ...state.chatList[index],
      unreadMessageCount: 0
    }
  )
  return {
    ...state,
    messages: [
      ...state.messages.filter(x => x.chatId !== chatId),
      ...(data.messages || []).map(msg =>
        ({ chatId, id: msg.id, text: msg.content, userId: msg.userId, time: msg.date }))
    ],
    selectedChatId: chatId,
    chatList: newChatList,
    waitingForMessages: false
  }
}

function handleChatMessagePrepended(state, { chatId, data }) {
  return {
    ...state,
    messages: [
      ...data.messages.map(msg =>
        ({ chatId, id: msg.id, text: msg.content, userId: msg.userId })),
      ...state.messages
    ],
    selectedChatId: chatId
  }
}

function handleNewUserRegistered(state, user) {
  if (state.contacts.some(x => x.id === user.id)) {
    return state;
  }
  return {
    ...state,
    contacts: [
      ...state.contacts,
      { id: user.id, title: user.name }
    ]
  }
}

function handleNewMessageReceived(state, { chatId, message }) {
  const newChatList = [...state.chatList];
  if (!state.chatList.some(x => x.id === chatId)) {
    const newChat = {
      time: message.date,
      unreadMessageCount: 1,
      avatar: '/avatar.png',
      id: chatId,
      name: state.contacts.find(x => x.id === message.userId).title
    }
    newChatList.push(newChat);
  }
  else if (state.selectedChatId !== chatId) {
    const index = state.chatList.findIndex(x => x.id === chatId);
    newChatList.splice(
      index,
      1,
      {
        ...state.chatList[index],
        unreadMessageCount: state.chatList[index].unreadMessageCount + 1,
        time: message.date
      }
    )
  }
  const newMessages = [
    ...state.messages,
    {
      chatId,
      id: message.id,
      text: message.content,
      userId: message.userId,
      time: message.date
    }
  ]
  return {
    ...state,
    messages: newMessages,
    chatList: newChatList
  }

}

function handleLoading(state) {
  return {
    ...state,
    loading: true
  };
}

function handleWaitingForMessage(state) {
  return {
    ...state,
    waitingForMessages: true
  }
}