const CACHE_NAME = 'pick4u-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Push event - Handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  let notificationData = {};
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (error) {
      notificationData = {
        title: 'Pick4U',
        body: event.data.text() || 'יש לך הודעה חדשה',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png'
      };
    }
  }

  const options = {
    title: notificationData.title || 'Pick4U',
    body: notificationData.body || 'יש לך הודעה חדשה',
    icon: notificationData.icon || '/icons/icon-192x192.png',
    badge: notificationData.badge || '/icons/icon-72x72.png',
    data: notificationData.data || {},
    tag: notificationData.tag || 'general',
    requireInteraction: notificationData.requireInteraction || false,
    actions: getNotificationActions(notificationData.data?.type),
    vibrate: [200, 100, 200],
    timestamp: Date.now(),
    dir: 'rtl',
    lang: 'he'
  };

  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const notificationData = event.notification.data || {};
  const action = event.action;
  
  // Handle different actions
  if (action === 'view' || !action) {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Try to focus existing window
          for (const client of clientList) {
            if (client.url.includes(self.location.origin)) {
              return client.focus();
            }
          }
          
          // Open new window
          let url = '/';
          
          // Navigate to specific page based on notification type
          if (notificationData.type === 'pickup_request') {
            url = '/?tab=collect';
          } else if (notificationData.type === 'chat_message') {
            url = `/?tab=notifications&chat=${notificationData.chatId}`;
          } else if (notificationData.type === 'price_update') {
            url = '/?tab=notifications';
          }
          
          return clients.openWindow(url);
        })
    );
  } else if (action === 'reply') {
    // Handle reply action for chat messages
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          const client = clientList[0];
          if (client) {
            client.postMessage({
              type: 'QUICK_REPLY',
              chatId: notificationData.chatId,
              senderId: notificationData.senderId
            });
            return client.focus();
          }
          return clients.openWindow(`/?tab=notifications&chat=${notificationData.chatId}`);
        })
    );
  } else if (action === 'accept') {
    // Handle accept action for price updates
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          const client = clientList[0];
          if (client) {
            client.postMessage({
              type: 'ACCEPT_PRICE',
              requestId: notificationData.requestId
            });
            return client.focus();
          }
          return clients.openWindow('/?tab=notifications');
        })
    );
  } else if (action === 'ignore') {
    // Handle ignore action - just close notification
    console.log('Notification ignored');
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync operations
      console.log('Background sync triggered')
    );
  }
});

// Helper function to get notification actions based on type
function getNotificationActions(type) {
  switch (type) {
    case 'pickup_request':
      return [
        {
          action: 'view',
          title: 'צפה בבקשה',
          icon: '/icons/view.png'
        },
        {
          action: 'ignore',
          title: 'התעלם',
          icon: '/icons/ignore.png'
        }
      ];
    case 'chat_message':
      return [
        {
          action: 'reply',
          title: 'השב',
          icon: '/icons/reply.png'
        },
        {
          action: 'view',
          title: 'צפה',
          icon: '/icons/view.png'
        }
      ];
    case 'price_update':
      return [
        {
          action: 'accept',
          title: 'אשר',
          icon: '/icons/accept.png'
        },
        {
          action: 'view',
          title: 'צפה',
          icon: '/icons/view.png'
        }
      ];
    default:
      return [
        {
          action: 'view',
          title: 'צפה',
          icon: '/icons/view.png'
        }
      ];
  }
}

// Handle message from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});