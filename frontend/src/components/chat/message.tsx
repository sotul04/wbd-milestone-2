import { useAuth } from "@/context/AuthContext";
import { Message } from "@/types";
import { useEffect } from "react";
import BubbleChat from "./bubble-chat";
import TypingBubble from "./typing-bubble";
import { useInView } from "react-intersection-observer";
import { LoaderCircleIcon } from "lucide-react";
import ScrollToBottom from "react-scroll-to-bottom";

interface MessagesProps {
    messages: Message[];
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    isFinished?: boolean;
    isTyping?: boolean;
}

const Messages = ({
    messages,
    isFetchingNextPage,
    fetchNextPage,
    isTyping = false,
}: MessagesProps) => {
    const auth = useAuth();

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage]);

    const formatTimestamp = (timestamp: string | Date) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <ScrollToBottom
            className="flex flex-grow flex-col-reverse overflow-y-auto border-t-2"
            scrollViewClassName="flex flex-col flex-col-reverse no-scrollbar p-6"
            initialScrollBehavior="smooth"
        >
            {isTyping && <TypingBubble />}
            {messages.map((msg, index) => (
                <BubbleChat
                    key={index}
                    timestamp={formatTimestamp(msg.timestamp)}
                    message={msg.message}
                    variant={msg.from_id === auth.userId.toString() ? "sent" : "received"}
                />
            ))}
            <div
                className="flex items-center justify-center py-2"
                ref={ref}
            >
                {isFetchingNextPage && <LoaderCircleIcon className="animate-spin"/>}
            </div>
        </ScrollToBottom>
    );
};

export default Messages;

