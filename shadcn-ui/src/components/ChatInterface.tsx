import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowRight, 
  Send, 
  Phone, 
  MapPin, 
  Package, 
  Clock, 
  DollarSign,
  User as UserIcon,
  CheckCircle
} from 'lucide-react';
import { User, PickupRequest, Message, Chat } from '@/types';

interface ChatInterfaceProps {
  requestId: string;
  currentUser: User;
  recipientId: string;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  requestId, 
  currentUser, 
  recipientId, 
  onClose 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [priceOffer, setPriceOffer] = useState('');
  const [showPriceOffer, setShowPriceOffer] = useState(false);
  const [agreedPrice, setAgreedPrice] = useState<number | null>(null);
  const [contactShared, setContactShared] = useState(false);
  const [request, setRequest] = useState<PickupRequest | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock request data
  useEffect(() => {
    const mockRequest: PickupRequest = {
      id: requestId,
      userId: recipientId,
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
    };
    setRequest(mockRequest);

    // Mock messages
    const mockMessages: Message[] = [
      {
        id: '1',
        chatId: requestId,
        senderId: recipientId,
        senderName: 'שרה כהן',
        content: 'שלום! אני צריכה עזרה עם איסוף החבילה',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        type: 'text',
        read: true
      },
      {
        id: '2',
        chatId: requestId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: 'שלום! אני יכול לעזור. איפה בדיוק הכתובת?',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        type: 'text',
        read: true
      },
      {
        id: '3',
        chatId: requestId,
        senderId: recipientId,
        senderName: 'שרה כהן',
        content: 'רחוב דיזנגוף 100, קומה 3. מתי אתה יכול להגיע?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'text',
        read: true
      }
    ];
    setMessages(mockMessages);
  }, [requestId, recipientId, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      chatId: requestId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleSendPriceOffer = () => {
    if (!priceOffer.trim()) return;

    const priceMessage: Message = {
      id: Date.now().toString(),
      chatId: requestId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: `הצעת מחיר: ₪${priceOffer}`,
      timestamp: new Date(),
      type: 'price_offer',
      priceOffer: parseFloat(priceOffer),
      read: false
    };

    setMessages(prev => [...prev, priceMessage]);
    setPriceOffer('');
    setShowPriceOffer(false);
  };

  const handleAcceptPrice = (price: number) => {
    setAgreedPrice(price);
    
    const acceptMessage: Message = {
      id: Date.now().toString(),
      chatId: requestId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: `מחיר מוסכם: ₪${price} ✅`,
      timestamp: new Date(),
      type: 'system',
      read: false
    };

    setMessages(prev => [...prev, acceptMessage]);
  };

  const handleShareContact = () => {
    setContactShared(true);
    
    const contactMessage: Message = {
      id: Date.now().toString(),
      chatId: requestId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: `פרטי קשר שותפו: ${currentUser.phone}`,
      timestamp: new Date(),
      type: 'system',
      read: false
    };

    setMessages(prev => [...prev, contactMessage]);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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

  if (!request) return null;

  return (
    <div className="flex flex-col h-screen bg-white" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          
          <div className="flex-1">
            <h2 className="font-semibold">{request.userName}</h2>
            <p className="text-sm text-blue-100">איסוף חבילה</p>
          </div>
          
          <Badge variant={getUrgencyColor(request.urgency)} className="bg-white/20 text-white">
            {getUrgencyText(request.urgency)}
          </Badge>
        </div>
      </div>

      {/* Request Summary */}
      <Card className="m-4 mb-2">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">פרטי הבקשה</h3>
              <Badge className="bg-green-100 text-green-800">
                עד ₪{request.maxPrice}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Package className="h-4 w-4 text-gray-500" />
                <span>{request.packageType}</span>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{request.address}, {request.city}</span>
              </div>
              
              <p className="text-gray-600">{request.description}</p>
            </div>

            {agreedPrice && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 space-x-reverse text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">מחיר מוסכם: ₪{agreedPrice}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === currentUser.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === currentUser.id
                    ? 'bg-blue-500 text-white'
                    : message.type === 'system'
                    ? 'bg-gray-100 text-gray-800 border'
                    : message.type === 'price_offer'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                
                {message.type === 'price_offer' && message.priceOffer && message.senderId !== currentUser.id && !agreedPrice && (
                  <div className="mt-2 space-x-2 space-x-reverse">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptPrice(message.priceOffer!)}
                      className="text-xs"
                    >
                      אשר מחיר
                    </Button>
                  </div>
                )}
                
                <p className="text-xs mt-1 opacity-70">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Price Agreement & Contact Sharing */}
      {agreedPrice && !contactShared && (
        <div className="p-4 bg-yellow-50 border-t border-yellow-200">
          <div className="text-center space-y-3">
            <p className="text-sm text-yellow-800">
              מחיר מוסכם! כדי לקבל את פרטי הקשר, לחץ על הכפתור למטה
            </p>
            <Button onClick={handleShareContact} className="w-full">
              שתף פרטי קשר
            </Button>
          </div>
        </div>
      )}

      {/* Contact Information */}
      {contactShared && (
        <div className="p-4 bg-green-50 border-t border-green-200">
          <div className="text-center space-y-2">
            <p className="text-sm text-green-800 font-medium">
              פרטי קשר שותפו!
            </p>
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <Phone className="h-4 w-4 text-green-600" />
              <span className="text-green-800">{request.userPhone}</span>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        {showPriceOffer ? (
          <div className="space-y-3">
            <div className="flex space-x-2 space-x-reverse">
              <Input
                type="number"
                placeholder="הכנס מחיר בש״ח"
                value={priceOffer}
                onChange={(e) => setPriceOffer(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSendPriceOffer} disabled={!priceOffer.trim()}>
                שלח הצעה
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPriceOffer(false)}
              className="w-full"
            >
              ביטול
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex space-x-2 space-x-reverse">
              <Input
                placeholder="כתוב הודעה..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {!agreedPrice && (
              <Button
                variant="outline"
                onClick={() => setShowPriceOffer(true)}
                className="w-full flex items-center space-x-2 space-x-reverse"
              >
                <DollarSign className="h-4 w-4" />
                <span>הצע מחיר</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;