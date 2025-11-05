import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, MapPin, Clock, DollarSign } from 'lucide-react';
import { User } from '@/types';

interface PickupRequestProps {
  user: User;
}

export default function PickupRequest({ user }: PickupRequestProps) {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    deliveryAddress: user.city,
    packageType: '',
    urgency: 'regular',
    maxPrice: '',
    description: '',
    contactInfo: user.phone
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('בקשת האיסוף נשלחה בהצלחה! תקבל התראה כשמאסף יגיב.');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
            צור בקשת איסוף חדשה
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            מלא את הפרטים ותקבל הצעות ממאספים באזור
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupLocation" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  מיקום איסוף
                </Label>
                <Input
                  id="pickupLocation"
                  placeholder="כתובת או שם החנות/סניף"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>
              
              <div>
                <Label htmlFor="deliveryAddress" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  כתובת משלוח
                </Label>
                <Input
                  id="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="packageType" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  סוג החבילה
                </Label>
                <Select value={formData.packageType} onValueChange={(value) => setFormData({ ...formData, packageType: value })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="בחר סוג חבילה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">חבילה קטנה (עד 2 ק״ג)</SelectItem>
                    <SelectItem value="medium">חבילה בינונית (2-10 ק״ג)</SelectItem>
                    <SelectItem value="large">חבילה גדולה (10+ ק״ג)</SelectItem>
                    <SelectItem value="documents">מסמכים/מכתבים</SelectItem>
                    <SelectItem value="fragile">פריט שביר</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="urgency" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  דחיפות
                </Label>
                <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">לא דחוף (עד שבוע)</SelectItem>
                    <SelectItem value="regular">רגיל (עד 3 ימים)</SelectItem>
                    <SelectItem value="urgent">דחוף (היום-מחר)</SelectItem>
                    <SelectItem value="immediate">מיידי (עד שעתיים)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="maxPrice" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                מחיר מקסימלי (ש״ח)
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="הכנס מחיר מקסימלי"
                value={formData.maxPrice}
                onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                className="rounded-xl"
              />
            </div>
            
            <div>
              <Label htmlFor="description">פרטים נוספים</Label>
              <Textarea
                id="description"
                placeholder="הוראות מיוחדות, זמני זמינות, וכל מידע רלוונטי אחר..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded-xl min-h-[100px]"
              />
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl">
              <h4 className="font-bold mb-3 text-lg">פרטי קשר</h4>
              <p className="text-sm text-gray-600 mb-4">
                פרטי הקשר שלך יחשפו רק לאחר שתאשר מאסף ותסכים על מחיר
              </p>
              <div className="flex items-center gap-3">
                <span className="font-medium">טלפון:</span>
                <span className="bg-white px-3 py-1 rounded-lg">{formData.contactInfo}</span>
              </div>
            </div>
            
            <Button type="submit" className="w-full text-xl py-6 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300">
              פרסם בקשת איסוף
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}