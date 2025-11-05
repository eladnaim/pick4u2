export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  community?: string;
  address: string;
  verified: boolean;
  rating: number;
  joinDate: Date;
  profilePicture?: string;
  isCollector: boolean;
  notificationSettings: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
    newRequests: boolean;
    priceUpdates: boolean;
    statusUpdates: boolean;
    communityNews: boolean;
  };
}

export interface PickupRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  city: string;
  community?: string;
  address: string;
  packageType: string;
  description: string;
  urgency: 'high' | 'normal' | 'low';
  maxPrice: number;
  status: 'open' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  acceptedBy?: string;
  acceptedAt?: Date;
  completedAt?: Date;
  collectorId?: string;
  collectorName?: string;
  estimatedPickupTime?: Date;
  actualPickupTime?: Date;
  notes?: string;
}

export interface Chat {
  id: string;
  pickupRequestId: string;
  participants: string[];
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
  agreedPrice?: number;
  priceNegotiated: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'price_offer' | 'system';
  priceOffer?: number;
  read: boolean;
}

export interface Pickup {
  id: string;
  requestId: string;
  collectorId: string;
  collectorName: string;
  scheduledTime: Date;
  actualTime?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  notes?: string;
  proofOfPickup?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'new_request' | 'price_update' | 'status_change' | 'system';
  read: boolean;
  createdAt: Date;
  relatedId?: string;
  priority: 'high' | 'normal' | 'low';
}