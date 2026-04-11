import { useCallback, useEffect, useRef, useState } from 'react';
import { appSocket, syncAppSocketAuth } from './appSocket';
import {
  getUserNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type UserNotificationItem,
} from '@/Modules/Notifications/Services/NotificationSV';

export type { UserNotificationItem };

export function useNotifications() {
  const [items, setItems] = useState<UserNotificationItem[]>([]);
  const prevLengthRef = useRef(-1);

  const unreadCount = items.filter((n) => !n.isRead).length;

  const fetchItems = useCallback(async () => {
    try {
      const data = await getUserNotifications();
      setItems(data);
      prevLengthRef.current = data.length;
    } catch {
      // Si falla el fetch, el estado queda sin cambios.
    }
  }, []);

  useEffect(() => {
    fetchItems();
    syncAppSocketAuth();

    const handler = (payload: unknown[]) => {
      if (prevLengthRef.current === -1) {
        prevLengthRef.current = payload.length;
        return;
      }
      if (payload.length > prevLengthRef.current) {
        // Llegaron notificaciones nuevas: re-fetch para obtener los IDs pivot correctos.
        fetchItems();
      }
    };

    appSocket.on('notification.all', handler);
    return () => {
      appSocket.off('notification.all', handler);
    };
  }, [fetchItems]);

  const markAllRead = useCallback(async () => {
    // Optimistic update inmediato.
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsRead();
    } catch {
      // Si falla, revertir obteniendo el estado real del backend.
      fetchItems();
    }
  }, [fetchItems]);

  const markOneRead = useCallback(async (userNotificationId: number) => {
    // Optimistic update inmediato.
    setItems((prev) =>
      prev.map((n) =>
        n.userNotificationId === userNotificationId ? { ...n, isRead: true } : n
      )
    );
    try {
      await markNotificationRead(userNotificationId);
    } catch {
      fetchItems();
    }
  }, [fetchItems]);

  return { items, unreadCount, markAllRead, markOneRead };
}
