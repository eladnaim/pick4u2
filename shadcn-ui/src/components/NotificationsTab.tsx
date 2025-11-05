import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageCircle, Package, Clock, MapPin, User, Settings } from 'lucide-react';
import { User as UserType, PickupRequest, Message } from '@/types';

interface NotificationsTabProps {
  user: UserType;
  onStartChat: (requestId: string, recipientId: string) => void;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'new_request' | 'price_update' | 'status_change' | 'system';
  read: boolean;
  createdAt: Date;
  relatedId?: string;
  priority: 'high' | 'normal' | 'low';
  requestData?: PickupRequest;
  senderName?: string;
  senderId?: string;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ user, onStartChat }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'requests' | 'messages'>('all');

  useEffect(() => {
    // Mock notifications data
    const mockNotifications: NotificationItem[] = [
      {
        id: '1',
        title: 'בקשת איסוף חדשה באזור שלך',
        message: 'שרה כהן מבקשת איסוף חבילה ברחוב דיזנגוף - עד ₪25',
        type: 'new_request',
        read: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        priority: 'high',
        relatedId: 'req1',
        senderName: 'שרה כהן',
        senderId: 'user1',
        requestData: {
          id: 'req1',
          userId: 'user1',
          userName: 'שרה כהן',
          userPhone: '050-1234567',
          city: 'תל אביב',
          address: 'רחוב דיזנגוף 100',
          packageType: 'חבילה קטנה',
          description: 'חבילה מאמזון, דחוף לקבל היום',
          urgency: 'high',
          maxPrice: 25,
          status: 'open',
          createdAt: new Date(),
        }
      },
      {
        id: '2',
        title: 'הצעת מחיר חדשה',
        message: 'דוד לוי הציע ₪20 לאיסוף החבילה שלך',
        type: 'price_update',
        read: false,
        createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        priority: 'normal',
        relatedId: 'req2',
        senderName: 'דוד לוי',
        senderId: 'user2'
      },
      {
        id: '3',
        title: 'סטטוס בקשה השתנה',
        message: 'הבקשה שלך התקבלה על ידי מירי אברהם',
        type: 'status_change',
        read: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        priority: 'normal',
        relatedId: 'req3',
        senderName: 'מירי אברהם',
        senderId: 'user3'
      },
      {
        id: '4',
        title: 'הודעה חדשה בצ\'אט',
        message: 'יוסי כהן: "אני יכול להגיע בשעה 16:00"',
        type: 'new_request',
        read: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        priority: 'normal',
        relatedId: 'chat1',
        senderName: 'יוסי כהן',
        senderId: 'user4'
      },
      {
        id: '5',
        title: 'עדכון מערכת',
        message: 'גרסה חדשה של האפליקציה זמינה להורדה',
        type: 'system',
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        priority: 'low'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'requests':
        return notification.type === 'new_request' || notification.type === 'status_change';
      case 'messages':
        return notification.type === 'price_update';
      default:
        return true;
    }
  });

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    markAsRead(notification.id);
    
    if (notification.senderId && notification.relatedId) {
      // Start chat with the sender
      onStartChat(notification.relatedId, notification.senderId);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_request':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'price_update':
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'status_change':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'system':
        return <Settings className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'normal':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'עכשיו';
    if (diffInMinutes < 60) return `לפני ${diffInMinutes} דקות`;
    if (diffInMinutes < 1440) return `לפני ${Math.floor(diffInMinutes / 60)} שעות`;
    return `לפני ${Math.floor(diffInMinutes / 1440)} ימים`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 p-4" dir="rtl">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-right flex items-center space-x-2 space-x-reverse">
            <Bell className="h-6 w-6" />
            <span>התרעות</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </h2>
        </div>

        {/* Filter buttons */}
        <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            הכל ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            לא נקראו ({unreadCount})
          </Button>
          <Button
            variant={filter === 'requests' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('requests')}
          >
            בקשות
          </Button>
          <Button
            variant={filter === 'messages' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('messages')}
          >
            הודעות
          </Button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">אין התרעות</h3>
              <p className="text-gray-600">כל ההתרעות שלך יופיעו כאן</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.read ? 'border-blue-200 bg-blue-50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          !notification.read ? 'text-gray-700' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        
                        {/* Additional info for request notifications */}
                        {notification.requestData && (
                          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span>{notification.requestData.address}, {notification.requestData.city}</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-600">
                                {notification.requestData.packageType}
                              </span>
                              <span className="text-sm font-medium text-green-600">
                                עד ₪{notification.requestData.maxPrice}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end space-y-1 mr-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.createdAt)}
                        </span>
                        <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                          {notification.priority === 'high' ? 'דחוף' : 
                           notification.priority === 'normal' ? 'רגיל' : 'נמוך'}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons for interactive notifications */}
                {notification.senderId && (
                  <div className="mt-3 flex space-x-2 space-x-reverse">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (notification.relatedId && notification.senderId) {
                          onStartChat(notification.relatedId, notification.senderId);
                        }
                      }}
                      className="flex items-center space-x-1 space-x-reverse"
                    >
                      <MessageCircle className="h-3 w-3" />
                      <span>פתח צ'אט</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Mark all as read button */}
      {unreadCount > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => {
              setNotifications(prev => 
                prev.map(notification => ({ ...notification, read: true }))
              );
            }}
          >
            סמן הכל כנקרא
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationsTab;