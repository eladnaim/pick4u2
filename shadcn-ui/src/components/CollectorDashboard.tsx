import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, Package, Phone, MessageCircle, Filter, Search } from 'lucide-react';
import { PickupRequest, User } from '@/types';
import { sendNotification } from '@/services/pushNotifications';

interface CollectorDashboardProps {
  user: User;
  onStartChat: (requestId: string, recipientId: string) => void;
}

const CollectorDashboard: React.FC<CollectorDashboardProps> = ({ user, onStartChat }) => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PickupRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  // Mock data - in real app, fetch from Firebase
  useEffect(() => {
    const mockRequests: PickupRequest[] = [
      {
        id: '1',
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
        createdAt: new Date('2024-01-15T10:00:00'),
        estimatedPickupTime: new Date('2024-01-15T16:00:00')
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'דוד לוי',
        userPhone: '052-9876543',
        city: 'רמת גן',
        address: 'רחוב ביאליק 25',
        packageType: 'מכתב רשום',
        description: 'מכתב חשוב מהבנק',
        urgency: 'normal',
        maxPrice: 15,
        status: 'open',
        createdAt: new Date('2024-01-15T09:30:00'),
        estimatedPickupTime: new Date('2024-01-15T14:00:00')
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'מרים אברהם',
        userPhone: '054-5555555',
        city: 'תל אביב',
        address: 'רחוב אלנבי 50',
        packageType: 'חבילה גדולה',
        description: 'רהיטים קטנים מאיקאה',
        urgency: 'low',
        maxPrice: 40,
        status: 'open',
        createdAt: new Date('2024-01-15T08:00:00'),
        estimatedPickupTime: new Date('2024-01-16T10:00:00')
      }
    ];
    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
  }, []);

  // Filter requests based on search and filters
  useEffect(() => {
    let filtered = requests.filter(request => {
      const matchesSearch = request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesUrgency = urgencyFilter === 'all' || request.urgency === urgencyFilter;
      const matchesCity = cityFilter === 'all' || request.city === cityFilter;
      
      return matchesSearch && matchesUrgency && matchesCity;
    });

    setFilteredRequests(filtered);
  }, [requests, searchTerm, urgencyFilter, cityFilter]);

  const handleAcceptRequest = async (request: PickupRequest) => {
    try {
      // Update request status
      const updatedRequests = requests.map(r => 
        r.id === request.id 
          ? { ...r, status: 'accepted' as const, collectorId: user.id, collectorName: user.name, acceptedAt: new Date() }
          : r
      );
      setRequests(updatedRequests);

      // Send notification to requester
      await sendNotification(request.userId, {
        title: 'בקשת האיסוף התקבלה!',
        body: `${user.name} קיבל את בקשת האיסוף שלך`,
        data: {
          type: 'request_accepted',
          requestId: request.id,
          collectorId: user.id
        }
      });

      // Start chat
      onStartChat(request.id, request.userId);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'normal': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'דחוף';
      case 'normal': return 'רגיל';
      case 'low': return 'לא דחוף';
      default: return 'רגיל';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  const getDistanceText = (city: string) => {
    // Mock distance calculation
    if (city === user.city) return 'באזור שלך';
    return `${Math.floor(Math.random() * 20) + 1} ק"מ`;
  };

  const uniqueCities = [...new Set(requests.map(r => r.city))];

  return (
    <div className="space-y-6 p-4" dir="rtl">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-right">בקשות איסוף זמינות</h2>
        
        {/* Search and Filters */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:space-x-reverse">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="חיפוש לפי שם, כתובת או תיאור..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="דחיפות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הרמות</SelectItem>
              <SelectItem value="high">דחוף</SelectItem>
              <SelectItem value="normal">רגיל</SelectItem>
              <SelectItem value="low">לא דחוף</SelectItem>
            </SelectContent>
          </Select>

          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="עיר" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הערים</SelectItem>
              {uniqueCities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
          <Filter className="h-4 w-4" />
          <span>נמצאו {filteredRequests.length} בקשות</span>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">אין בקשות זמינות</h3>
              <p className="text-gray-600">נסה לשנות את הפילטרים או לחזור מאוחר יותר</p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{request.userName}</CardTitle>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{request.address}, {request.city}</span>
                      <Badge variant="outline" className="text-xs">
                        {getDistanceText(request.city)}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={getUrgencyColor(request.urgency)}>
                    {getUrgencyText(request.urgency)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{request.packageType}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{request.description}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>נוצר: {formatTime(request.createdAt)}</span>
                  </div>
                  {request.estimatedPickupTime && (
                    <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>איסוף מבוקש: {formatTime(request.estimatedPickupTime)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-lg font-bold text-green-600">
                    עד ₪{request.maxPrice}
                  </div>
                  
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStartChat(request.id, request.userId)}
                      className="flex items-center space-x-1 space-x-reverse"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>צ'אט</span>
                    </Button>
                    
                    <Button
                      onClick={() => handleAcceptRequest(request)}
                      size="sm"
                      className="flex items-center space-x-1 space-x-reverse"
                    >
                      <span>קבל בקשה</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CollectorDashboard;