// firebase-messaging-sw.js

self.addEventListener('push', function(event) {
    console.log('[SW] Push-событие получено!');

    let data = { title: 'Новое сообщение', body: 'У вас новое уведомление' };

    if (event.data) {
        try {
            data = event.data.json();
            console.log('[SW] Данные push-сообщения (JSON):', data);
        } catch (e) {
            // Если данные не JSON, пытаемся прочитать как текст
            const textData = event.data.text();
            data = { title: 'Уведомление', body: textData };
            console.log('[SW] Данные push-сообщения (текст):', textData);
        }
    } else {
        console.log('[SW] Push-сообщение без данных.');
    }

    // Извлекаем данные для уведомления, отдавая приоритет полям от Firebase FCM/Web Push
    const notificationTitle = data.notification?.title || data.title || 'Новое уведомление';
    const notificationBody = data.notification?.body || data.body || 'Без сообщения';
    const notificationIcon = data.notification?.icon || data.icon || '/icon-192.png'; // Убедитесь, что у вас есть этот файл
    const notificationData = data.notification?.data || data.data || { url: '/' }; // Дополнительные данные, включая URL
    const notificationTag = data.notification?.tag || Date.now().toString(); // Добавляем тег для уникальности

    const options = {
        body: notificationBody,
        icon: notificationIcon,
        badge: '/badge.png', // Убедитесь, что у вас есть этот файл
        data: notificationData,
        vibrate: [100, 50, 100],
        tag: notificationTag, // Используем тег
        renotify: true, // Показывает уведомление снова, если с тем же тегом пришло новое
        actions: [
            { action: 'open', title: 'Открыть' }
            // Можете добавить другие действия, например:
            // { action: 'reply', title: 'Ответить' }
        ]
    };

    console.log('[SW] Показ уведомления:', notificationTitle, options);

    event.waitUntil(
        self.registration.showNotification(notificationTitle, options)
        .catch(error => {
            console.error('[SW] Ошибка при показе уведомления:', error);
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    console.log('[SW] Клик по уведомлению:', event.notification.tag, 'Действие:', event.action);

    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';
    const action = event.action;

    if (action === 'open') { // Обработка стандартного действия 'open'
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
                for (let i = 0; i < clientList.length; i++) {
                    let client = clientList[i];
                    if (client.url === urlToOpen && 'focus' in client) {
                        console.log('[SW] Фокусировка на существующем окне:', client.url);
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    console.log('[SW] Открытие нового окна:', urlToOpen);
                    return clients.openWindow(urlToOpen);
                }
            }).catch(error => {
                console.error('[SW] Ошибка при обработке клика по уведомлению или открытии окна:', error);
            })
        );
    } else {
        // Здесь можно добавить обработку других действий уведомлений
        console.log(`[SW] Неизвестное действие уведомления: ${action}`);
    }
});
