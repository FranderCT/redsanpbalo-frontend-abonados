import { useEffect, useRef, useState } from 'react';
import { notificationSocket, syncNotificationSocketAuth } from './notificationSocket';

export interface NotificationSummary {
  Id: number;
  Subject: string;
  Message: string;
  Hour: string;
  CreatedAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationSummary[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    syncNotificationSocketAuth();

    const handler = (payload: NotificationSummary[]) => {
      setNotifications(payload);
      const newCount = payload.length - prevLengthRef.current;
      if (newCount > 0) {
        setUnreadCount((prev) => prev + newCount);
      }
      prevLengthRef.current = payload.length;
    };

    notificationSocket.on('notification.all', handler);
    return () => {
      notificationSocket.off('notification.all', handler);
    };
  }, []);

  const markAllRead = () => setUnreadCount(0);

  return { notifications, unreadCount, markAllRead };
}
