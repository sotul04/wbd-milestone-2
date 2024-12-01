interface BubbleChatProps {
    timestamp?: string;
    message: string;
    variant: 'sent' | 'received';
    chatRef?: React.Ref<HTMLDivElement> | null;
}

const BubbleChat: React.FC<BubbleChatProps> = ({
    timestamp,
    message,
    variant,
    chatRef,
}) => {
    const bubbleClasses = `relative text-white max-w-xs p-3 pb-2 rounded-2xl text-sm ${variant === 'sent'
            ? 'bg-blue-500 self-end'
            : 'bg-gray-700 self-start'
        }`;

    return (
        <div
            className={`flex ${variant === 'sent' ? 'justify-end' : 'justify-start'} mb-2`}
            ref={chatRef ?? null}
        >
            <div className={bubbleClasses}>
                <div className="text-md break-words pb-[6px]">{message}</div>
                <div
                    className={`text-[11px] text-[#e9e9e9] text-opacity-75 ${variant === 'sent' ? 'text-left' : 'text-right'
                        }`}
                >
                    {timestamp}
                </div>
                <div
                    className={`absolute h-0 w-0 border-[10px] ${variant === 'sent'
                            ? 'bottom-0 right-0 -translate-y-1/3 translate-x-1/2 transform border-blue-500 border-r-transparent border-t-transparent'
                            : 'bottom-0 left-0 -translate-x-1/2 -translate-y-1/3 transform border-gray-700 border-l-transparent border-t-transparent'
                        }`}
                />
            </div>
        </div>
    );
};

export default BubbleChat;