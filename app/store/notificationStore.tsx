import { create } from 'zustand';

export interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
}

const useNotificationStore = create<{
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  deleteNotification: (id: number) => void;
}>(
  (set) => ({
    notifications: [
      {
        id: 1,
        title: 'New bill',
        message: 'Your bill for January is available.',
        date: 'Nov 1',
      },
      {
        id: 3,
        title: 'New deal',
        message: 'Check out our new data deal.',
        date: 'Nov 1',
      },
    ],
    addNotification: (notification) =>
      set((state) => ({
        notifications: [...state.notifications, notification],
      })),
    deleteNotification: (id) =>
      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification.id !== id
        ),
      })),
  })
);


export default useNotificationStore;
