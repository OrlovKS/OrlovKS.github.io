// firebase-messaging-sw.js

self.addEventListener('push', function(event) {
    console.log('[SW] Push получен');

    let data = { title: 'Новое сообщение', body: 'У вас новое уведомление' };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = { title: 'Уведомление', body: event.data.text() };
        }
    }

    const options = {
        body: data.body || data.notification?.body,
        icon: data.icon || data.notification?.icon || '/icon-192.png',
        badge: '/badge.png',
        data: data.data || { url: '/' },
        vibrate: [100, 50, 100],
        actions: [
            { action: 'open', title: 'Открыть' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || data.notification?.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
