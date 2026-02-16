// firebase-messaging-sw.js

self.addEventListener('push', function(event) {
    console.log('[SW] Push получен');

    let data = { title: 'Новое сообщение', body: 'У вас новое уведомление' };

    if (event.data) {
        try {
            data = event.data.json();
            console.log('[SW] Push-сообщение JSON:', data);
        } catch (e) {
            // Если данные не JSON, пытаемся прочитать как текст
            data = { title: 'Уведомление', body: event.data.text() };
            console.log('[SW] Push-сообщение (текст):', data.body);
        }
    }

    // Извлекаем данные для уведомления, отдавая приоритет полям от Firebase FCM/Web Push
    const notificationTitle = data.notification?.title || data.title || 'Новое уведомление';
    const notificationBody = data.notification?.body || data.body || 'Без сообщения';
    const notificationIcon = data.notification?.icon || data.icon || '/icon-192.png'; // Убедитесь, что у вас есть этот файл
    const notificationData = data.notification?.data || data.data || { url: '/' }; // Дополнительные данные, включая URL

    const options = {
        body: notificationBody,
        icon: notificationIcon,
        badge: '/badge.png', // Убедитесь, что у вас есть этот файл
        data: notificationData,
        vibrate: [100, 50, 100],
        actions: [
            { action: 'open', title: 'Открыть' }
            // Можете добавить другие действия, например:
            // { action: 'reply', title: 'Ответить' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(notificationTitle, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    console.log('[SW] Клик по уведомлению:', event.notification.tag);

    event.notification.close();

    // Получаем URL для открытия из данных уведомления
    const urlToOpen = event.notification.data?.url || '/';
    const action = event.action; // Действие, которое было выполнено (например, 'open')

    console.log(`[SW] Действие: ${action}, URL для открытия: ${urlToOpen}`);

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Пытаемся найти уже открытое окно с этим URL и сфокусироваться на нем
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    console.log('[SW] Фокусировка на существующем окне:', client.url);
                    return client.focus();
                }
            }
            // Если окно не найдено, открываем новое
            if (clients.openWindow) {
                console.log('[SW] Открытие нового окна:', urlToOpen);
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
