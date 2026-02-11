// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js');

// Инициализация Firebase (ВАШ КОНФИГ)
firebase.initializeApp({
  apiKey: "AIzaSyDrffu7zN8rWmH7U9y3LizaDdq4uCql5YU",
  authDomain: "test-push-project-a500f.firebaseapp.com",
  projectId: "test-push-project-a500f",
  storageBucket: "test-push-project-a500f.firebasestorage.app",
  messagingSenderId: "158649760157",
  appId: "1:158649760157:web:eaf6427ad06429c7bbd774",
  measurementId: "G-XSSPSBXPFE"
});

const messaging = firebase.messaging();

// ========== ОБРАБОТКА PUSH УВЕДОМЛЕНИЙ ==========

// 1. Firebase фоновые сообщения
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Фоновое сообщение Firebase:', payload);
  
  const notificationTitle = payload.notification?.title || 'Новое уведомление';
  const notificationOptions = {
    body: payload.notification?.body || 'У вас новое сообщение',
    icon: payload.notification?.icon || 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
    image: payload.notification?.image,
    tag: 'firebase-push',
    timestamp: Date.now(),
    data: payload.data || { url: self.location.origin },
    actions: [
      {
        action: 'open',
        title: '📂 Открыть'
      },
      {
        action: 'dismiss',
        title: '✕ Закрыть'
      }
    ],
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 2. Стандартный обработчик push событий
self.addEventListener('push', (event) => {
  console.log('[SW] Push событие получено');
  
  let payload = {};
  
  try {
    if (event.data) {
      payload = event.data.json();
      console.log('[SW] Данные push:', payload);
    }
  } catch (error) {
    console.log('[SW] Ошибка парсинга JSON:', error);
    // Если данные в текстовом формате
    payload = {
      title: 'Уведомление',
      body: event.data ? event.data.text() : 'Новое сообщение'
    };
  }
  
  // Определяем параметры уведомления
  const title = payload.notification?.title || payload.title || 'Новое уведомление';
  const options = {
    body: payload.notification?.body || payload.body || 'У вас новое сообщение',
    icon: payload.notification?.icon || payload.icon || 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
    image: payload.notification?.image || payload.image,
    tag: payload.notification?.tag || payload.tag || 'web-push',
    data: payload.data || payload,
    actions: payload.actions || [
      {
        action: 'open',
        title: 'Открыть'
      }
    ],
    requireInteraction: payload.requireInteraction || false,
    silent: payload.silent || false,
    vibrate: payload.vibrate || [200, 100, 200],
    timestamp: Date.now()
  };
  
  console.log('[SW] Показываем уведомление:', title);
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 3. Обработка кликов по уведомлению
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Клик по уведомлению:', event.notification.tag);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || 
                    self.location.origin || 
                    'https://orlovks.github.io';
  
  // Обработка действий
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(urlToOpen)
    );
  } else if (event.action === 'dismiss') {
    // Просто закрываем
    console.log('[SW] Уведомление закрыто');
  } else {
    // Обычный клик по уведомлению
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then((clientList) => {
        // Ищем открытую вкладку нашего сайта
        for (const client of clientList) {
          if (client.url.includes(self.location.hostname) && 'focus' in client) {
            return client.focus();
          }
        }
        // Открываем новую вкладку
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// 4. Обработка закрытия уведомления
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Уведомление закрыто:', event.notification.tag);
});

// 5. Service Worker установка
self.addEventListener('install', (event) => {
  console.log('[SW] Установлен');
  self.skipWaiting(); // Немедленная активация
});

// 6. Service Worker активация
self.addEventListener('activate', (event) => {
  console.log('[SW] Активирован');
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // Немедленный контроль над клиентами
      // Очистка старых кешей
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName.startsWith('push-')) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// 7. Обработка сообщений от основного скрипта
self.addEventListener('message', (event) => {
  console.log('[SW] Сообщение от клиента:', event.data);
  
  if (event.data && event.data.type === 'PING') {
    event.ports[0].postMessage({ type: 'PONG', message: 'SW работает' });
  }
  
  if (event.data && event.data.type === 'TEST_NOTIFICATION') {
    self.registration.showNotification('Тест из SW', {
      body: 'Service Worker отвечает!',
      icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png'
    });
  }
});

// 8. Функция для проверки SW
self.checkStatus = () => {
  return {
    status: 'active',
    scope: self.registration ? self.registration.scope : 'unknown',
    clients: 'ready'
  };
};

console.log('[SW] Firebase Messaging Service Worker загружен и готов к работе');
