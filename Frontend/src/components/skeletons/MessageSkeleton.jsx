const MessageSkeleton = () => {
    const skeletonMessages = Array(6).fill(null);
  
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-black">
        {skeletonMessages.map((_, idx) => (
          <div
            key={idx}
            className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}
          >
            {/* Avatar */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full">
                <div className="skeleton w-full h-full rounded-full bg-neutral-200 dark:bg-neutral-700" />
              </div>
            </div>
  
            {/* Header */}
            <div className="chat-header mb-1">
              <div className="skeleton h-4 w-16 bg-neutral-200 dark:bg-neutral-700" />
            </div>
  
            {/* Message bubble */}
            <div className="chat-bubble bg-transparent p-0">
              <div className="skeleton h-16 w-[200px] bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default MessageSkeleton;
  