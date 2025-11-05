import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Phone, Mail, MapPin, Lock, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '@/types';
import { israeliCities } from '@/data/cities';

interface UserRegistrationProps {
  onRegister: (user: UserType) => void;
  onSwitchToLogin: () => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    community: '',
    address: '',
    isCollector: false,
    agreeToTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'אנא הכנס שם מלא';
    if (!formData.phone.trim()) return 'אנא הכנס מספר טלפון';
    if (!formData.password) return 'אנא הכנס סיסמה';
    if (formData.password !== formData.confirmPassword) return 'הסיסמאות אינן תואמות';
    if (!formData.city) return 'אנא בחר עיר';
    if (!formData.address.trim()) return 'אנא הכנס כתובת';
    if (!formData.agreeToTerms) return 'אנא אשר את תנאי השימוש';
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);

    try {
      // Mock registration - in real app, use Firebase Auth
      const newUser: UserType = {
        id: `user_${Date.now()}`,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        city: formData.city,
        community: formData.community || undefined,
        address: formData.address,
        verified: false,
        rating: 5.0,
        joinDate: new Date(),
        isCollector: formData.isCollector,
        notificationSettings: {
          pushEnabled: true,
          emailEnabled: true,
          smsEnabled: false,
          newRequests: true,
          priceUpdates: true,
          statusUpdates: true,
          communityNews: false
        }
      };
      
      onRegister(newUser);
    } catch (error) {
      setError('שגיאה בהרשמה. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCityData = israeliCities.find(city => city.name === formData.city);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
      <Card className="w-full max-w-md max-h-screen overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            הרשמה ל-Pick4U
          </CardTitle>
          <p className="text-gray-600 mt-2">
            צור חשבון חדש כדי להתחיל
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">שם מלא *</Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="הכנס שם מלא"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pr-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">מספר טלפון *</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="050-1234567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pr-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">אימייל (אופציונלי)</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">סיסמה *</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="הכנס סיסמה"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pr-10 pl-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">אישור סיסמה *</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="אשר סיסמה"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pr-10 pl-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city">עיר *</Label>
                <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר עיר" />
                  </SelectTrigger>
                  <SelectContent>
                    {israeliCities.map((city) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCityData?.communities && selectedCityData.communities.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="community">קהילה/שכונה (אופציונלי)</Label>
                  <Select value={formData.community} onValueChange={(value) => handleInputChange('community', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר קהילה" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCityData.communities.map((community) => (
                        <SelectItem key={community} value={community}>
                          {community}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="address">כתובת *</Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="רחוב ומספר בית"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="pr-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Collector Option */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="isCollector"
                checked={formData.isCollector}
                onCheckedChange={(checked) => handleInputChange('isCollector', checked as boolean)}
              />
              <Label htmlFor="isCollector" className="text-sm">
                אני רוצה להיות גם מאסף (לקבל בקשות איסוף)
              </Label>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                required
              />
              <Label htmlFor="agreeToTerms" className="text-sm">
                אני מסכים ל<span className="text-blue-600 underline cursor-pointer">תנאי השימוש</span> ול<span className="text-blue-600 underline cursor-pointer">מדיניות הפרטיות</span> *
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'נרשם...' : 'הירשם'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              יש לך כבר חשבון?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                התחבר כאן
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRegistration;