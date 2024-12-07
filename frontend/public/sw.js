self.addEventListener("push", (event) => {
    if (!event.data) {
        console.error("Push event received without data.");
        return;
    }

    try {
        const data = event.data.json();
        const { title = "Notification", body = "", description = "", icon = "/purry.ico", data: notificationData = {} } = data;

        const notificationOptions = {
            body: `${body}\n${description}`,
            icon,
            tag: notificationData.tag || "unique-tag",
            data: {
                url: notificationData.url || "/",
                description
            },
        };

        self.registration.showNotification(title, notificationOptions);
    } catch (error) {
        console.error("Error parsing push event data:", error);
    }
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const { url } = event.notification.data;

    if (url) {
        event.waitUntil(
            clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
                for (const client of clientList) {
                    if (client.url === url && "focus" in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
        );
    }
});
