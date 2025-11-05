import { messaging, requestNotificationPermission, onForegroundMessage } from '@/config/firebase';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: {
    [key: string]: string;
  };
}

export const sendNotification = async (userId: string, payload: NotificationPayload) => {
  try {
    // In a real app, this would send to your backend API
    // which would then send the notification via Firebase Admin SDK
    console.log('Sending notification to user:', userId, payload);
    
    // For demo purposes, show a local notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(payload.title, {
        body: payload.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png'
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error };
  }
};

export const initializePushNotifications = async () => {
  try {
    const token = await requestNotificationPermission();
    
    if (token) {
      console.log('FCM Token:', token);
      // Store token in your database associated with the user
      return token;
    }
    
    return null;
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return null;
  }
};

export const subscribeToNotifications = (callback: (payload: any) => void) => {
  return onForegroundMessage(callback);
};

export const requestPermission = async (): Promise<boolean> => {
  try {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const showLocalNotification = (title: string, options?: NotificationOptions) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      ...options
    });
  }
  return null;
};

// Service for managing user notification preferences
export class NotificationService {
  private static instance: NotificationService;
  private token: string | null = null;
  private unsubscribe: (() => void) | null = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<string | null> {
    this.token = await initializePushNotifications();
    
    // Subscribe to foreground messages
    this.unsubscribe = subscribeToNotifications((payload) => {
      console.log('Received foreground message:', payload);
      
      // Show notification if app is in foreground
      if (payload.notification) {
        showLocalNotification(payload.notification.title, {
          body: payload.notification.body,
          data: payload.data
        });
      }
    });
    
    return this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  async updateUserPreferences(userId: string, preferences: any): Promise<boolean> {
    try {
      // In a real app, send preferences to your backend
      console.log('Updating notification preferences for user:', userId, preferences);
      
      // Store preferences locally for demo
      localStorage.setItem(`notification_prefs_${userId}`, JSON.stringify(preferences));
      
      return true;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  }

  getUserPreferences(userId: string): any {
    try {
      const stored = localStorage.getItem(`notification_prefs_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return null;
    }
  }

  cleanup(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}

export default NotificationService;