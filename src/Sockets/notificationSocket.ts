import { io } from 'socket.io-client';

export const notificationSocket = io('http://localhost:3000/notification', {
  autoConnect: false,
  auth: {
    token: '',
  },
});

export function syncNotificationSocketAuth() {
  const token = localStorage.getItem('token') ?? '';
  notificationSocket.auth = { token };

  if (!token) {
    if (notificationSocket.connected) {
      notificationSocket.disconnect();
    }
    return;
  }

  if (notificationSocket.connected) {
    notificationSocket.disconnect();
  }

  notificationSocket.connect();
}
