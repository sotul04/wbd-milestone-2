import { ChatApi } from "@/api/chat-api";
import ChatCard from "@/components/chat/profile-card";
import { UserAside } from "@/components/user/user-aside";
import { useEffect, useState } from "react";

interface ChatsType {
    first_user: {
        id: string;
        full_name: string | null;
        profile_photo_path: string;
    };
    second_user: {
        id: string;
        full_name: string | null;
        profile_photo_path: string;
    };
    id: string;
    updated_at: Date;
    last_message: string | null;
}

export default function Chats() {
    const [chats, setChats] = useState<ChatsType[]>([]);

    async function fetchChats() {
        try {
            const response = await ChatApi.getUserChats();
            setChats(response.body);
        } catch (error) {
            console.error((error as any)?.message);
        }
    }

    useEffect(() => {
        fetchChats();
    }, []);

    return <section className="flex flex-col items-center">
        <div className="flex container flex-col md:flex-row md:gap-8 p-4">
            <aside className="w-full md:w-1/4 mb-6 hidden md:block">
                <UserAside />
            </aside>

            <main className="w-full md:w-3/4">
                <div className="grid grid-cols-1 gap-3">
                    {chats.map(chat => 
                        <ChatCard 
                            key={chat.id}
                            {...chat}
                        />
                    )}
                </div>
            </main>
        </div>
    </section>
}