// src/context/PushNotificationContext.tsx
import React, { createContext, useContext, useEffect } from "react";
import { NotifApi } from "@/api/notif-api";
import { useAuth } from "./AuthContext";

interface PushNotificationContextType {
    subscribeToPushNotifications: () => Promise<void>;
}

const PushNotificationContext = createContext<PushNotificationContextType>({
    subscribeToPushNotifications: async () => { },
});

export const PushNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuth();

    const subscribeToPushNotifications = async () => {
        if ("serviceWorker" in navigator) {
            try {
                const register = await navigator.serviceWorker.register("/sw.js");

                const subscription = await register.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
                });

                await NotifApi.subscribe({
                    user_id: auth.authenticated ? auth.userId.toString() : null,
                    endpoint: subscription.endpoint,
                    keys: subscription.toJSON().keys,
                });

            } catch (error) {
                console.error("Error during subscription:", error);
            }
        }
    };

    useEffect(() => {
        subscribeToPushNotifications();
    }, [auth.authenticated]);

    return (
        <PushNotificationContext.Provider value={{ subscribeToPushNotifications }}>
            {children}
        </PushNotificationContext.Provider>
    );
};

export const usePushNotification = () => useContext(PushNotificationContext);
