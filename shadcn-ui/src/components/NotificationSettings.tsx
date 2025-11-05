import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, BellOff, Smartphone, Mail, MessageSquare, Info } from 'lucide-react';
import { User } from '@/types';
import NotificationService from '@/services/pushNotifications';

interface NotificationSettingsProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ user, onUpdateUser }) => {
  const [settings, setSettings] = useState(user.notificationSettings);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkNotificationSupport();
    checkPermissionStatus();
  }, []);

  const checkNotificationSupport = () => {
    setIsSupported('Notification' in window);
  };

  const checkPermissionStatus = () => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  };

  const requestPermission = async () => {
    if (!isSupported) return;

    setLoading(true);
    try {
      const notificationService = NotificationService.getInstance();
      await notificationService.initialize();
      checkPermissionStatus();
    } catch (error) {
      console.error('Error requesting permission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (setting: keyof typeof settings, value: boolean) => {
    const updatedSettings = { ...settings, [setting]: value };
    setSettings(updatedSettings);

    const updatedUser = {
      ...user,
      notificationSettings: updatedSettings
    };
    onUpdateUser(updatedUser);

    // Update preferences in service
    const notificationService = NotificationService.getInstance();
    notificationService.updateUserPreferences(user.id, updatedSettings);
  };

  const testNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pick4U - התרעת בדיקה', {
        body: 'זוהי התרעת בדיקה מהאפליקציה',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png'
      });
    }
  };

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case 'granted':
        return { text: 'מאושר', color: 'text-green-600', bgColor: 'bg-green-100' };
      case 'denied':
        return { text: 'נדחה', color: 'text-red-600', bgColor: 'bg-red-100' };
      default:
        return { text: 'לא נבחר', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    }
  };

  const statusInfo = getPermissionStatusText();

  return (
    <div className="space-y-6 p-4" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-right flex items-center space-x-2 space-x-reverse">
          <Bell className="h-6 w-6" />
          <span>הגדרות התרעות</span>
        </h2>
      </div>

      {/* Permission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Smartphone className="h-5 w-5" />
            <span>סטטוס הרשאות</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">התרעות דחיפה</p>
              <p className="text-sm text-gray-600">הרשאה לשליחת התרעות למכשיר</p>
            </div>
            <Badge className={`${statusInfo.bgColor} ${statusInfo.color}`}>
              {statusInfo.text}
            </Badge>
          </div>

          {!isSupported && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                הדפדפן שלך לא תומך בהתרעות דחיפה
              </AlertDescription>
            </Alert>
          )}

          {isSupported && permissionStatus !== 'granted' && (
            <div className="space-y-3">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  כדי לקבל התרעות על בקשות איסוף חדשות, יש צורך באישור הרשאות
                </AlertDescription>
              </Alert>
              <Button 
                onClick={requestPermission} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'מבקש הרשאה...' : 'אשר התרעות'}
              </Button>
            </div>
          )}

          {permissionStatus === 'granted' && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 space-x-reverse text-green-600">
                <Bell className="h-4 w-4" />
                <span className="text-sm">התרעות מופעלות ומוכנות לשימוש</span>
              </div>
              <Button 
                variant="outline" 
                onClick={testNotification}
                className="w-full"
              >
                שלח התרעת בדיקה
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>סוגי התרעות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-enabled" className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <Smartphone className="h-4 w-4 text-gray-500" />
                <div>
                  <span>התרעות Push</span>
                  <p className="text-xs text-gray-600">התרעות מיידיות למכשיר</p>
                </div>
              </Label>
              <Switch
                id="push-enabled"
                checked={settings.pushEnabled}
                onCheckedChange={(checked) => handleSettingChange('pushEnabled', checked)}
                disabled={permissionStatus !== 'granted'}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="email-enabled" className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <span>התרעות אימייל</span>
                  <p className="text-xs text-gray-600">עדכונים חשובים באימייל</p>
                </div>
              </Label>
              <Switch
                id="email-enabled"
                checked={settings.emailEnabled}
                onCheckedChange={(checked) => handleSettingChange('emailEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sms-enabled" className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <div>
                  <span>התרעות SMS</span>
                  <p className="text-xs text-gray-600">הודעות טקסט למצבי חירום</p>
                </div>
              </Label>
              <Switch
                id="sms-enabled"
                checked={settings.smsEnabled}
                onCheckedChange={(checked) => handleSettingChange('smsEnabled', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Content */}
      <Card>
        <CardHeader>
          <CardTitle>תוכן התרעות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="new-requests" className="cursor-pointer">
              <div>
                <span>בקשות איסוף חדשות</span>
                <p className="text-xs text-gray-600">התרעה על בקשות באזור שלך</p>
              </div>
            </Label>
            <Switch
              id="new-requests"
              checked={settings.newRequests}
              onCheckedChange={(checked) => handleSettingChange('newRequests', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="price-updates" className="cursor-pointer">
              <div>
                <span>עדכוני מחירים</span>
                <p className="text-xs text-gray-600">הצעות מחיר והסכמות</p>
              </div>
            </Label>
            <Switch
              id="price-updates"
              checked={settings.priceUpdates}
              onCheckedChange={(checked) => handleSettingChange('priceUpdates', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="status-updates" className="cursor-pointer">
              <div>
                <span>עדכוני סטטוס</span>
                <p className="text-xs text-gray-600">שינויים בסטטוס הבקשות</p>
              </div>
            </Label>
            <Switch
              id="status-updates"
              checked={settings.statusUpdates}
              onCheckedChange={(checked) => handleSettingChange('statusUpdates', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="community-news" className="cursor-pointer">
              <div>
                <span>חדשות קהילה</span>
                <p className="text-xs text-gray-600">עדכונים כלליים מהקהילה</p>
              </div>
            </Label>
            <Switch
              id="community-news"
              checked={settings.communityNews}
              onCheckedChange={(checked) => handleSettingChange('communityNews', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>פעולות מהירות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            onClick={() => {
              const allEnabled = {
                pushEnabled: true,
                emailEnabled: true,
                smsEnabled: false,
                newRequests: true,
                priceUpdates: true,
                statusUpdates: true,
                communityNews: true
              };
              setSettings(allEnabled);
              onUpdateUser({ ...user, notificationSettings: allEnabled });
            }}
            className="w-full"
          >
            הפעל את כל ההתרעות
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              const allDisabled = {
                pushEnabled: false,
                emailEnabled: false,
                smsEnabled: false,
                newRequests: false,
                priceUpdates: false,
                statusUpdates: false,
                communityNews: false
              };
              setSettings(allDisabled);
              onUpdateUser({ ...user, notificationSettings: allDisabled });
            }}
            className="w-full"
          >
            <BellOff className="h-4 w-4 ml-2" />
            כבה את כל ההתרעות
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;