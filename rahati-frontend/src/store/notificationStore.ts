import { create } from 'zustand';
import { Notification } from '../types';
import { notificationsAPI } from '../services/api';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationsAPI.getNotifications();
      const notifications = response.data.data || response.data;
      const unreadCount = notifications.filter((n: Notification) => !n.is_read).length;
      
      set({ 
        notifications, 
        unreadCount,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to fetch notifications.' 
      });
    }
  },

  markAsRead: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await notificationsAPI.markNotificationAsRead(id);
      
      // Update local state
      const { notifications } = get();
      const updatedNotifications = notifications.map(notification => 
        notification.id === id ? { ...notification, is_read: true } : notification
      );
      
      const unreadCount = updatedNotifications.filter(n => !n.is_read).length;
      
      set({ 
        notifications: updatedNotifications, 
        unreadCount,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to mark notification as read.' 
      });
    }
  },

  deleteNotification: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await notificationsAPI.deleteNotification(id);
      
      // Update local state
      const { notifications } = get();
      const deletedNotification = notifications.find(n => n.id === id);
      const updatedNotifications = notifications.filter(n => n.id !== id);
      
      // Adjust unread count if the deleted notification was unread
      const unreadCount = deletedNotification && !deletedNotification.is_read 
        ? get().unreadCount - 1 
        : get().unreadCount;
      
      set({ 
        notifications: updatedNotifications, 
        unreadCount,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to delete notification.' 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
