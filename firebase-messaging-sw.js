// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js');

// Инициализация Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDrffu7zN8rWmH7U9y3LizaDdq4uCql5YU",
  authDomain: "test-push-project-a500f.firebaseapp.com",
  projectId: "test-push-project-a500f",
  storageBucket: "test-push-project-a500f.firebasestorage.app",
  messagingSenderId: "158649760157",
  appId: "1:158649760157:web:eaf6427ad06429c7bbd774",
  measurementId: "G-XSSPSBXPFE"
});

const baseUrl = self.location.origin;
const messaging = firebase.messaging();

// 1. Обработка фоновых сообщений Firebase
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Фоновое сообщение от Firebase:', payload);
  
  const notificationTitle = payload.notification?.title || 'Новое уведомление';
  const notificationOptions = {
    body: payload.notification?.body || 'У вас новое сообщение',
    icon: payload.notification?.icon || 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
    tag: 'firebase-push', // Группировка уведомлений
    data: payload.data || { url: 'http://localhost:8080' }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 2. Обработка стандартных push событий (для прямых запросов)
self.addEventListener('push', (event) => {
  console.log('[SW] Push событие получено!', event);
  
  let title = 'Новое уведомление';
  let body = 'У вас новое сообщение';
  let icon = 'https://cdn-icons-png.flaticon.com/512/124/124010.png';
  let data = { url: 'http://localhost:8080' };
  
  try {
    if (event.data) {
      const payload = event.data.json();
      console.log('[SW] Данные push:', payload);
      
      title = payload.notification?.title || payload.title || title;
      body = payload.notification?.body || payload.body || body;
      icon = payload.notification?.icon || payload.icon || icon;
      data = payload.data || data;
    }
  } catch (error) {
    console.log('[SW] Ошибка парсинга данных:', error);
    // Если данные в текстовом формате
    if (event.data) {
      body = event.data.text() || body;
    }
  }
  
  console.log('[SW] Показываем уведомление:', { title, body });
  
  const options = {
    body: body,
    icon: icon,
    badge: 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
    tag: 'web-push', // Группировка
    requireInteraction: false, // Автоматически не исчезает
    data: data,
    actions: [
      {
        action: 'open',
        title: 'Открыть'
      },
      {
        action: 'close',
        title: 'Закрыть'
      }
    ]
  };
  
  // ВАЖНО: event.waitUntil - уведомление покажется только с этим
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 3. Обработка кликов по уведомлению
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Клик по уведомлению:', event.notification);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || 
                    baseUrl;
  
  // Обработка действий в уведомлении
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(urlToOpen)
    );
  } else if (event.action === 'close') {
    // Просто закрываем
    console.log('[SW] Уведомление закрыто пользователем');
  } else {
    // Обычный клик по уведомлению
    event.waitUntil(
      clients.matchAll({ 
        type: 'window', 
        includeUncontrolled: true 
      }).then((clientList) => {
        // Ищем открытую вкладку
        for (const client of clientList) {
          if (client.url.includes('localhost') && 'focus' in client) {
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

// 4. Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Активирован, берем контроль над клиентами');
  event.waitUntil(self.clients.claim());
});

// 5. Установка
self.addEventListener('install', (event) => {
  console.log('[SW] Установлен, активируем сразу');
  self.skipWaiting(); // Немедленная активация
});

// 6. Для отладки - отвечаем на сообщения
self.addEventListener('message', (event) => {
  console.log('[SW] Получено сообщение:', event.data);
  if (event.data && event.data.type === 'TEST') {
    self.registration.showNotification('Тест из SW', {
      body: 'Service Worker работает!',
      icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png'
    });
  }
});
