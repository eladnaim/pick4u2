import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  User as UserIcon, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Calendar, 
  Bell, 
  Shield, 
  Settings,
  Edit,
  Camera
} from 'lucide-react';
import { User } from '@/types';

interface UserProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [notifications, setNotifications] = useState(user.notificationSettings);

  const handleNotificationChange = (setting: keyof typeof notifications, value: boolean) => {
    const updatedNotifications = { ...notifications, [setting]: value };
    setNotifications(updatedNotifications);
    
    const updatedUser = {
      ...user,
      notificationSettings: updatedNotifications
    };
    onUpdateUser(updatedUser);
  };

  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6 p-4" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-right">הפרופיל שלי</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditMode(!editMode)}
          className="flex items-center space-x-1 space-x-reverse"
        >
          <Edit className="h-4 w-4" />
          <span>{editMode ? 'ביטול' : 'עריכה'}</span>
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-10 w-10 text-white" />
                )}
              </div>
              {editMode && (
                <Button
                  size="sm"
                  className="absolute -bottom-1 -left-1 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <h3 className="text-xl font-bold">{user.name}</h3>
                {user.verified && (
                  <Badge variant="secondary" className="flex items-center space-x-1 space-x-reverse">
                    <Shield className="h-3 w-3" />
                    <span>מאומת</span>
                  </Badge>
                )}
                {user.isCollector && (
                  <Badge className="bg-green-100 text-green-800">
                    מאסף
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-1 space-x-reverse mb-2">
                {getRatingStars(user.rating)}
                <span className="text-sm text-gray-600 mr-1">
                  ({user.rating.toFixed(1)})
                </span>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>הצטרף ב-{formatJoinDate(user.joinDate)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <UserIcon className="h-5 w-5" />
            <span>פרטים אישיים</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="font-medium">טלפון:</span>
            <span>{user.phone}</span>
          </div>
          
          {user.email && (
            <div className="flex items-center space-x-3 space-x-reverse">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="font-medium">אימייל:</span>
              <span>{user.email}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="font-medium">כתובת:</span>
            <span>{user.address}, {user.city}</span>
          </div>
          
          {user.community && (
            <div className="flex items-center space-x-3 space-x-reverse">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="font-medium">קהילה:</span>
              <span>{user.community}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Bell className="h-5 w-5" />
            <span>הגדרות התרעות</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General notification types */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-700">סוגי התרעות</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <span>התרעות Push</span>
              </Label>
              <Switch
                id="push-notifications"
                checked={notifications.pushEnabled}
                onCheckedChange={(checked) => handleNotificationChange('pushEnabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <span>התרעות אימייל</span>
              </Label>
              <Switch
                id="email-notifications"
                checked={notifications.emailEnabled}
                onCheckedChange={(checked) => handleNotificationChange('emailEnabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications" className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <span>התרעות SMS</span>
              </Label>
              <Switch
                id="sms-notifications"
                checked={notifications.smsEnabled}
                onCheckedChange={(checked) => handleNotificationChange('smsEnabled', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Specific notification categories */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-700">תוכן התרעות</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="new-requests" className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <span>בקשות איסוף חדשות</span>
              </Label>
              <Switch
                id="new-requests"
                checked={notifications.newRequests}
                onCheckedChange={(checked) => handleNotificationChange('newRequests', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="price-updates" className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <span>עדכוני מחירים</span>
              </Label>
              <Switch
                id="price-updates"
                checked={notifications.priceUpdates}
                onCheckedChange={(checked) => handleNotificationChange('priceUpdates', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="status-updates" className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <span>עדכוני סטטוס</span>
              </Label>
              <Switch
                id="status-updates"
                checked={notifications.statusUpdates}
                onCheckedChange={(checked) => handleNotificationChange('statusUpdates', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="community-news" className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <span>חדשות קהילה</span>
              </Label>
              <Switch
                id="community-news"
                checked={notifications.communityNews}
                onCheckedChange={(checked) => handleNotificationChange('communityNews', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Settings className="h-5 w-5" />
            <span>הגדרות חשבון</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            שנה סיסמה
          </Button>
          <Button variant="outline" className="w-full justify-start">
            מדיניות פרטיות
          </Button>
          <Button variant="outline" className="w-full justify-start">
            תנאי שימוש
          </Button>
          <Button variant="outline" className="w-full justify-start">
            צור קשר
          </Button>
          <Separator />
          <Button variant="destructive" className="w-full">
            התנתק מהחשבון
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;