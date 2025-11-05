import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Package, 
  Truck, 
  Bell, 
  Navigation, 
  User as UserIcon,
  LogOut,
  MessageCircle
} from 'lucide-react';
import { User } from '@/types';
import UserRegistration from '@/components/UserRegistration';
import LoginForm from '@/components/LoginForm';
import PickupRequest from '@/components/PickupRequest';
import CollectorDashboard from '@/components/CollectorDashboard';
import NotificationsTab from '@/components/NotificationsTab';
import UserProfile from '@/components/UserProfile';
import ChatInterface from '@/components/ChatInterface';
import CollectorNow from '@/components/CollectorNow';

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [chatRecipientId, setChatRecipientId] = useState<string | null>(null);
  const [lang, setLang] = useState<'he' | 'en'>('he');

  // Test login for development
  const handleTestLogin = () => {
    const testUser: User = {
      id: 'test-user-123',
      name: 'משתמש בדיקה',
      phone: '050-1234567',
      email: 'test@example.com',
      city: 'תל אביב',
      address: 'רחוב הבדיקה 123',
      verified: true,
      rating: 4.9,
      joinDate: new Date('2024-01-01'),
      isCollector: true,
      notificationSettings: {
        pushEnabled: true,
        emailEnabled: true,
        smsEnabled: false,
        newRequests: true,
        priceUpdates: true,
        statusUpdates: true,
        communityNews: true
      }
    };
    setUser(testUser);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setShowLogin(false);
  };

  const handleRegister = (newUser: User) => {
    setUser(newUser);
    setShowRegister(false);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
    setActiveRequestId(null);
    setChatRecipientId(null);
  };

  const handleStartChat = (requestId: string, recipientId: string) => {
    setActiveRequestId(requestId);
    setChatRecipientId(recipientId);
    setActiveTab('chat');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Show registration form
  if (showRegister) {
    return (
      <UserRegistration
        onRegister={handleRegister}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    );
  }

  // Show login form
  if (showLogin) {
    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
    );
  }

  // Main app interface
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {!user ? (
        // Welcome screen
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
          <div className="text-center space-y-8 max-w-md">
            <div className="space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <Package className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Pick4U v2</h1>
              <p className="text-lg text-gray-600">
                האפליקציה הקהילתית לאיסוף חבילות ודואר
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => setShowLogin(true)}
                className="w-full text-lg py-6"
                size="lg"
              >
                התחבר לחשבון קיים
              </Button>
              
              <Button 
                onClick={() => setShowRegister(true)}
                variant="outline"
                className="w-full text-lg py-6"
                size="lg"
              >
                צור חשבון חדש
              </Button>

              {/* Test login button for development */}
              <Button 
                onClick={handleTestLogin}
                variant="secondary"
                className="w-full text-sm py-3"
                size="sm"
              >
                כניסה לבדיקה (למפתחים)
              </Button>
            </div>

            <div className="text-sm text-gray-500 space-y-2">
              <p>✨ בקשות איסוף פשוטות ומהירות</p>
              <p>🚚 מציאת מאספים באזור שלך</p>
              <p>💬 מערכת צ'אט לתיאום מחירים</p>
              <p>🔔 התרעות על בקשות חדשות</p>
            </div>
          </div>
        </div>
      ) : (
        // Logged in interface
        <div className="max-w-md mx-auto bg-white min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-semibold">{user.name}</h2>
                  <p className="text-sm text-blue-100">{user.city}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                {user.verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    מאומת
                  </Badge>
                )}
                <div className="flex items-center gap-2 mr-2">
                  <Button variant={lang === 'he' ? 'default' : 'outline'} size="sm" className="px-2" onClick={() => setLang('he')}>HE</Button>
                  <Button variant={lang === 'en' ? 'default' : 'outline'} size="sm" className="px-2" onClick={() => setLang('en')}>EN</Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          {activeTab === 'chat' && activeRequestId && chatRecipientId && (
            <div className="h-screen">
              <ChatInterface
                requestId={activeRequestId}
                currentUser={user}
                recipientId={chatRecipientId}
                onClose={() => {
                  setActiveRequestId(null);
                  setChatRecipientId(null);
                  setActiveTab('home');
                }}
              />
            </div>
          )}

          {/* Main Tabs */}
          {activeTab !== 'chat' && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <div className="flex-1 overflow-y-auto pb-20">
                <TabsContent value="home" className="mt-0">
                  <div className="p-6 space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">{lang === 'he' ? `ברוך הבא, ${user.name}!` : `Welcome, ${user.name}!`}</h3>
                      <p className="text-gray-600">{lang === 'he' ? 'בחר פעולה:' : 'Choose an action:'}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <Button 
                        onClick={() => setActiveTab('request')}
                        className="w-full text-xl py-6 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        {lang === 'he' ? 'מבקש איסוף' : 'Pickup Request'}
                      </Button>

                      {user.isCollector && (
                        <Button 
                          onClick={() => setActiveTab('collector_now')}
                          className="w-full text-xl py-6 h-16 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                          {lang === 'he' ? 'אני מאסף כעת' : "I'm collecting now"}
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="request" className="mt-0">
                  <PickupRequest user={user} />
                </TabsContent>

                {user.isCollector && (
                  <TabsContent value="collector" className="mt-0">
                    <CollectorDashboard user={user} onStartChat={handleStartChat} />
                  </TabsContent>
                )}

                {user.isCollector && (
                  <TabsContent value="collector_now" className="mt-0">
                    <CollectorNow user={user} />
                  </TabsContent>
                )}

                <TabsContent value="notifications" className="mt-0">
                  <NotificationsTab user={user} onStartChat={handleStartChat} />
                </TabsContent>

                <TabsContent value="navigation" className="mt-0">
                  <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">ניווט</h2>
                    <p className="text-gray-600">מפה וניווט יתווספו בקרוב...</p>
                  </div>
                </TabsContent>

                <TabsContent value="profile" className="mt-0">
                  <UserProfile user={user} onUpdateUser={handleUpdateUser} />
                </TabsContent>
              </div>

              {/* Bottom Navigation */}
              <TabsList className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-white border-t grid grid-cols-5 rounded-none">
                <TabsTrigger value="home" className="flex flex-col items-center py-2">
                  <Home className="h-5 w-5" />
                  <span className="text-xs mt-1">בית</span>
                </TabsTrigger>
                
                <TabsTrigger value="request" className="flex flex-col items-center py-2">
                  <Package className="h-5 w-5" />
                  <span className="text-xs mt-1">בקש</span>
                </TabsTrigger>
                
                {user.isCollector && (
                  <TabsTrigger value="collector" className="flex flex-col items-center py-2">
                    <Truck className="h-5 w-5" />
                    <span className="text-xs mt-1">אסוף</span>
                  </TabsTrigger>
                )}
                
                <TabsTrigger value="notifications" className="flex flex-col items-center py-2">
                  <Bell className="h-5 w-5" />
                  <span className="text-xs mt-1">התרעות</span>
                </TabsTrigger>
                
                <TabsTrigger value="profile" className="flex flex-col items-center py-2">
                  <UserIcon className="h-5 w-5" />
                  <span className="text-xs mt-1">פרופיל</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      )}
    </div>
  );
}