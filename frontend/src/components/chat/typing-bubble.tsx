const TypingBubble = () => {
    const bubbleClasses = `relative text-white max-w-xs p-3 pb-1 rounded-2xl text-sm bg-gray-700 self-start`;

    return (
        <div
            className={`flex justify-start mb-2 animate-in`}
        >
            <div className={bubbleClasses}>
                <div className="flex gap-2 pb-[12px] pt-[10px]">
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce duration-700"></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce duration-700"></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce duration-700"></div>
                </div>
                <div
                    className={`absolute h-0 w-0 border-[10px] bottom-0 left-0 -translate-x-1/2 -translate-y-1/3 transform border-gray-700 border-l-transparent border-t-transparent`}
                />
            </div>
        </div>
    );
};

export default TypingBubble;