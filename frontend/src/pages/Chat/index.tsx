import { ChatApi } from "@/api/chat-api";
import ChatCard from "@/components/chat/profile-card";
import { UserAside } from "@/components/user/user-aside";
import { useEffect, useState } from "react";
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddChatIcon } from "@/components/link/svgs";

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
            <aside className="w-full md:w-1/4 mb-6 space-y-3 pb-6 border-b-2 md:border-none">
                <UserAside title="Chat" content="Get to know the people around you better" />
            </aside>

            <main className="w-full md:w-3/4">
                {chats.length <= 0 ? <>
                    <div className="flex items-center justify-center p-1">
                        <p className="text-center text-sm text-[#808080]">No Chat</p>
                    </div>
                </> : <>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center pr-1">
                            <Popover>
                                <PopoverTrigger className="rounded-lg items-center gap-1 flex text-[#808080] hover:text-black px-2">
                                    <AddChatIcon className="w-7 h-7"/>
                                    <span className="text-xs">New Chat</span>
                                </PopoverTrigger>
                                <PopoverContent className="rounded-xl w-[min(calc(100vw-10px),600px)]">
                                    <Command className="max-h-64">
                                        <CommandInput placeholder="Search user..." />
                                        <CommandList className="overflow-y-scroll no-scrollbar">
                                            <CommandEmpty>No user found.</CommandEmpty>
                                            {chats.map(chat =>
                                                <CommandItem key={chat.id} className="p-0 my-2">
                                                    <ChatCard
                                                        {...chat}
                                                    />
                                                </CommandItem>
                                            )}
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <div className="flex-grow border"></div>
                        </div>
                        {chats.map(chat =>
                            <ChatCard
                                key={chat.id}
                                {...chat}
                            />
                        )}
                    </div>
                </>}
            </main>
        </div>
    </section>
}