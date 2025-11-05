import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Plus, Search } from 'lucide-react';
import { User } from '@/types';
import { israeliCities } from '@/data/cities';

interface CommunitySetupProps {
  user: User;
  onComplete: (updatedUser: User) => void;
}

const CommunitySetup: React.FC<CommunitySetupProps> = ({ user, onComplete }) => {
  const [selectedCity, setSelectedCity] = useState(user.city || '');
  const [selectedCommunity, setSelectedCommunity] = useState(user.community || '');
  const [customCommunity, setCustomCommunity] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isCollector, setIsCollector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCities = israeliCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCityData = israeliCities.find(city => city.name === selectedCity);
  const communities = selectedCityData?.communities || [];

  const handleSubmit = () => {
    const finalCommunity = showCustomInput ? customCommunity : selectedCommunity;
    
    const updatedUser: User = {
      ...user,
      city: selectedCity,
      community: finalCommunity || undefined,
      isCollector: isCollector
    };

    onComplete(updatedUser);
  };

  const isValid = selectedCity && (selectedCommunity || customCommunity || !showCustomInput);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            הגדרת קהילה
          </CardTitle>
          <p className="text-gray-600 mt-2">
            בחר את העיר והקהילה שלך כדי למצוא בקשות איסוף באזור
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* City Selection */}
          <div className="space-y-3">
            <Label htmlFor="city-search">חיפוש עיר</Label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="city-search"
                placeholder="הקלד שם העיר..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <div className="max-h-40 overflow-y-auto border rounded-lg">
              {filteredCities.slice(0, 10).map((city) => (
                <div
                  key={city.name}
                  className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                    selectedCity === city.name ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => {
                    setSelectedCity(city.name);
                    setSelectedCommunity('');
                    setSearchTerm('');
                  }}
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{city.name}</span>
                    {city.communities && city.communities.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {city.communities.length} קהילות
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected City Display */}
          {selectedCity && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 space-x-reverse">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">עיר נבחרה: {selectedCity}</span>
              </div>
            </div>
          )}

          {/* Community Selection */}
          {selectedCity && (
            <div className="space-y-3">
              <Label>בחר קהילה/שכונה (אופציונלי)</Label>
              
              {communities.length > 0 ? (
                <div className="space-y-2">
                  <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר קהילה" />
                    </SelectTrigger>
                    <SelectContent>
                      {communities.map((community) => (
                        <SelectItem key={community} value={community}>
                          {community}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="custom-community"
                      checked={showCustomInput}
                      onCheckedChange={(checked) => {
                        setShowCustomInput(checked as boolean);
                        if (!checked) setCustomCommunity('');
                      }}
                    />
                    <Label htmlFor="custom-community" className="text-sm">
                      הקהילה שלי לא ברשימה
                    </Label>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-3">
                    אין קהילות רשומות עבור {selectedCity}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCustomInput(true)}
                    className="flex items-center space-x-1 space-x-reverse"
                  >
                    <Plus className="h-4 w-4" />
                    <span>הוסף קהילה</span>
                  </Button>
                </div>
              )}

              {/* Custom Community Input */}
              {showCustomInput && (
                <div className="space-y-2">
                  <Label htmlFor="custom-community-input">שם הקהילה/שכונה</Label>
                  <Input
                    id="custom-community-input"
                    placeholder="הכנס שם הקהילה..."
                    value={customCommunity}
                    onChange={(e) => setCustomCommunity(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Collector Option */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="is-collector"
                checked={isCollector}
                onCheckedChange={(checked) => setIsCollector(checked as boolean)}
              />
              <Label htmlFor="is-collector">
                אני רוצה להיות גם מאסף (לקבל בקשות איסוף)
              </Label>
            </div>
            
            {isCollector && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  כמאסף, תוכל לראות בקשות איסוף באזור שלך ולהרוויח כסף על ידי עזרה לשכנים.
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full"
          >
            המשך
          </Button>

          {/* Skip Option */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => onComplete(user)}
              className="text-sm text-gray-600"
            >
              דלג על שלב זה
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunitySetup;