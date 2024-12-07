self.addEventListener("push", (event) => {
    if (!event.data) {
        console.error("Push event received without data.");
        return;
    }

    try {
        const data = event.data.json();
        const { title = "Notification", body = "", description = "", icon = "/purry.ico", data: notificationData = {} } = data;

        const notificationOptions = {
            body: `${body}\n\n${description}`,
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
                let matchingClient = null;

                for (const client of clientList) {
                    if (client.url === url && "focus" in client) {
                        matchingClient = client;
                        break;
                    }
                }

                if (matchingClient) {
                    // If localhost:5173 is open, reload the window
                    return matchingClient.navigate(url);
                } else if (clients.openWindow) {
                    // If no window is open, open the URL
                    return clients.openWindow(url);
                }
            })
        );
    }
});
