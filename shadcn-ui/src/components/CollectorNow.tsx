import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Navigation, Bell } from 'lucide-react';
import notificationService from '@/services/notificationService';
import { User } from '@/types';

interface CollectorNowProps {
  user: User;
  lang?: 'he' | 'en';
}

export default function CollectorNow({ user, lang = 'he' }: CollectorNowProps) {
  const t = {
    he: {
      title: 'אני מאסף כעת',
      desc: 'עדכן את הקהילה שאתה פעיל עכשיו לאיסופים באזור שלך',
      locationLabel: 'מיקום',
      autoOption: 'מיקום אוטומטי (GPS)',
      manualOption: 'הזנה ידנית',
      manualPlaceholder: 'הקלד כתובת/אזור',
      detectBtn: 'איתור אוטומטי',
      broadcastBtn: 'שדר לקהילה',
      success: 'נשלחה התרעה לקהילה שהינך פעיל עכשיו',
      error: 'שגיאה בשליחת התרעה. נסה שוב.',
      detecting: 'מאתר מיקום...'
    },
    en: {
      title: "I'm collecting now",
      desc: 'Notify your community you are currently active for pickups',
      locationLabel: 'Location',
      autoOption: 'Automatic (GPS)',
      manualOption: 'Manual input',
      manualPlaceholder: 'Type address/area',
      detectBtn: 'Detect location',
      broadcastBtn: 'Broadcast to community',
      success: 'Broadcast sent: you are active now',
      error: 'Failed to send broadcast. Please try again.',
      detecting: 'Detecting location...'
    }
  }[lang];

  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [manualLocation, setManualLocation] = useState('');
  const [autoLocation, setAutoLocation] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleDetectLocation = async () => {
    if (!('geolocation' in navigator)) {
      alert('GPS לא זמין בדפדפן');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const text = `lat: ${latitude.toFixed(5)}, lng: ${longitude.toFixed(5)}`;
        setAutoLocation(text);
        setLoading(false);
      },
      () => {
        setLoading(false);
        alert('נכשל באיתור מיקום');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleBroadcast = async () => {
    try {
      const locationText = mode === 'auto' ? autoLocation : manualLocation;
      const bodyHe = `המאסף ${user.name} פעיל עכשיו בקהילה ${user.community || ''} בעיר ${user.city}. מיקום: ${locationText || 'לא נמסר'}`;
      const bodyEn = `${user.name} is now active for pickups in ${user.community || ''}, ${user.city}. Location: ${locationText || 'N/A'}`;

      await notificationService.createNotification({
        userId: 'all',
        title: lang === 'he' ? 'מאסף פעיל באזור!' : 'Collector active nearby!',
        body: lang === 'he' ? bodyHe : bodyEn,
        type: 'system',
        data: {
          city: user.city,
          community: user.community || '',
          activeCollectorId: user.id,
          locationText
        },
        read: false
      });

      notificationService.showBrowserNotification(
        lang === 'he' ? 'השידור נשלח' : 'Broadcast sent',
        { body: lang === 'he' ? t.success : t.success }
      );

      alert(t.success);
    } catch (e) {
      console.error(e);
      alert(t.error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold">
            {t.title}
          </CardTitle>
          <CardDescription className="text-gray-600">{t.desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {t.locationLabel}</Label>
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as 'auto' | 'manual')} className="mt-2 grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 space-x-reverse p-3 border rounded-xl">
                  <RadioGroupItem value="auto" id="auto" />
                  <Label htmlFor="auto">{t.autoOption}</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse p-3 border rounded-xl">
                  <RadioGroupItem value="manual" id="manual" />
                  <Label htmlFor="manual">{t.manualOption}</Label>
                </div>
              </RadioGroup>
            </div>

            {mode === 'manual' ? (
              <div>
                <Input
                  placeholder={t.manualPlaceholder}
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button type="button" onClick={handleDetectLocation} disabled={loading} className="rounded-xl">
                  <Navigation className="w-4 h-4 mr-2" /> {loading ? t.detecting : t.detectBtn}
                </Button>
                <div className="text-sm text-gray-600">{autoLocation || (loading ? t.detecting : '')}</div>
              </div>
            )}

            <Button onClick={handleBroadcast} className="w-full text-xl py-6 h-16 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all duration-300">
              <Bell className="w-5 h-5 mr-2" /> {t.broadcastBtn}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}