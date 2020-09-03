import Chatbox from '../pages/chat/index';
import Login from '../pages/login/index';

export default function routes() {
  return [
    {
      component: Login,
      path: '/login',
      private: false
    },
    {
      component: Chatbox,
      path: '/chat',
      private: true
    },
    {
      component: Login,
      path: '/',
      private: false
    }
  ]
}