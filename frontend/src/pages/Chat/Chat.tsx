import { Link, useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChatApi } from "@/api/chat-api";
import { useCallback, useEffect, useRef, useState } from "react";
import Messages from "@/components/chat/message";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/ChatContext";
import { Card } from "@/components/ui/card";
import { ChevronLeftIcon, SendHorizonalIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotifApi } from "@/api/notif-api";

interface UserProps {
    first_user_id: string;
    second_user_id: string;
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
}

export default function UserChat() {
    const { roomId } = useParams<{ roomId: string }>();
    const auth = useAuth();
    const { socket } = useSocket();

    if (!roomId) {
        throw new Error("RoomId is required");
    }

    const [messages, setMessages] = useState<
        { from_id: string; to_id: string; message: string; timestamp: Date }[]
    >([]);
    const [addedMessages, setAddedMessages] = useState<{ from_id: string; to_id: string; message: string; timestamp: Date }[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [users, setUsers] = useState<UserProps>();
    const [isTyping, setTyping] = useState(false);
    const [accessible, setAccessible] = useState(true);
    const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    if (!accessible) {
        throw new Error("Unaccessible");
    }

    const fetchItems = useCallback(
        async ({ pageParam }: { pageParam: Date | null }) => {
            if (!roomId) throw new Error("Room ID is required");
            return await ChatApi.LoadChat({ roomId, cursor: pageParam });
        },
        [roomId]
    );

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await ChatApi.getRoomChatUsers({ roomId: roomId! });
                setUsers(response.body);
            } catch (error) {
                if ((error as any)?.message === 'Unauthorized') {
                    setAccessible(false);
                }
            }
        }
        fetchUsers();
    }, [roomId]);

    useEffect(() => {
        socket?.emit("join_chat", { room_id: roomId });

        socket?.on("receive_message", (message) => {
            setTyping(false);
            setAddedMessages((prevMessages) => [message, ...prevMessages]);
        });

        socket?.on("receive_typing", () => {
            setTyping(true);
            typingTimeout.current && clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => {
                setTyping(false);
            }, 1000);
        });

        return () => {
            socket?.off("receive_message");
            socket?.off("receive_typing");
        };
    }, [roomId, socket]);

    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage
    } = useInfiniteQuery({
        queryKey: ["chats", roomId],
        queryFn: fetchItems,
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    useEffect(() => {
        if (data) {
            const dataFetched = data.pages.flatMap(page => page.data || []);
            setMessages([...addedMessages, ...dataFetched]);
        }
    }, [data, addedMessages]);

    const handleTyping = () => {
        socket?.emit("typing", { room_id: roomId });
    };

    const sendTyping = useCallback(() => {
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }
        handleTyping();
        typingTimeout.current = setTimeout(() => {
            clearTimeout(typingTimeout.current!);
        }, 1000);
    }, [socket, roomId]);

    const sendMessage = () => {
        if (newMessage.trim() !== "") {
            const message = {
                from_id: auth.userId.toString(),
                to_id: users
                    ? users.first_user_id === auth.userId.toString()
                        ? users.second_user_id
                        : users.first_user_id
                    : "0",
                message: newMessage,
                timestamp: new Date(),
                room_id: roomId,
            };

            socket?.emit("send_message", message);
            setAddedMessages(prev => [message, ...prev]);
            setNewMessage("");
            NotifApi.pushChat({
                name: auth.name.length > 0 ? auth.name : "Unknown",
                to_id: message.to_id,
                room_id: roomId,
                message: message.message
            })
        }
    };

    return (
        <section className="flex flex-col h-[calc(100vh-80px)] items-center px-2">
            <Card className="container h-[calc(100%-20px)] py-4 my-5 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Link aria-label="Go back button" to='/chat'><ChevronLeftIcon /></Link>
                    {users && users.first_user_id !== auth.userId.toString() && <>
                        <Avatar aria-label="User Avatar" className="h-12 w-12 border">
                            {users.first_user.profile_photo_path !== '' &&
                                <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${users.first_user.profile_photo_path}`} />
                            }
                            <AvatarFallback className="font-semibold text-lg">{users.first_user.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold">{users.first_user.full_name}</p>
                    </>
                    }
                    {users && users.second_user_id !== auth.userId.toString() && <>
                        <Avatar aria-label="User Avatar" className="h-12 w-12 border">
                            {users.second_user.profile_photo_path !== '' &&
                                <AvatarImage src={`${import.meta.env.VITE_API_URL}/storage/${users.second_user.profile_photo_path}`} />
                            }
                            <AvatarFallback className="font-semibold text-lg">{users.second_user.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold">{users.second_user.full_name}</p>
                    </>
                    }
                </div>
                <Messages
                    isTyping={isTyping}
                    messages={messages}
                    hasNextPage={!!hasNextPage}
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                />
                <div className="flex gap-2 items-center">
                    <textarea
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            sendTyping();
                        }}
                        placeholder="Type a message..."
                        className="border rounded-md text-sm px-2 py-1 text-area-scrollbar h-[50px] resize-none flex-grow"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                    />
                    <button aria-label="Send message button" onClick={sendMessage} className="hover:text-[#808080] transition-all px-1 rounded-sm">
                        <SendHorizonalIcon />
                    </button>
                </div>
            </Card>
        </section >
    );
}
