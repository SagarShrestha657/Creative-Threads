import React, { useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore";
import ChatHeader from "./ChatHeaderComponent";
import ChatInput from "./ChatInputComponent";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useAuthStore } from "../../store/useAuthStore";
import { formatMessageTime } from "../../lib/utils";
import { socket } from "../../lib/socket";

const ChatContainer = () => {
  const {
    getMessages,
    selectedUser,
    messages,
    isMessageLoading,
    addNewMessageToChat,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Fetch messages when selectedUser changes
  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);

    const handleReceiveMessage = (msg) => {
      if (!msg?.message || !msg?.senderId) {
        console.error("Received message format is incorrect:", msg);
        return;
      }

      // Ignore messages sent by the current user
      if (msg.senderId === authUser._id) return;

      const newMessage = {
        _id: new Date().getTime(),
        senderId: msg.senderId,
        text: msg.message.text || "",
        image: msg.message.image || "",
        createdAt: msg.createdAt || new Date().toISOString(),
      };

      addNewMessageToChat(newMessage);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [selectedUser._id]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="sticky top-0 z-10 bg-black">
          <ChatHeader />
        </div>
        <MessageSkeleton />
        <div className="sticky bottom-0 z-10 bg-black">
          <ChatInput />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-black">
        <ChatHeader />
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-base-200 text-white 
        scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#52525b transparent",
        }}
      >
        {messages.map((message) => {
          const isSender = message.senderId === authUser._id;
          const profilePic = isSender
            ? authUser.profilePic || "/avatar.png"
            : selectedUser.profilePic || "/avatar.png";

          return (
            <div
              key={message._id || `${message.senderId}-${message.createdAt}`}
              className={`flex ${isSender ? "justify-end" : "justify-start"} `}
            >
              <div
                className={`flex ${
                  isSender ? "flex-row-reverse" : "flex-row"
                } items-end gap-2 max-w-[80%]`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700">
                  <img
                    src={profilePic}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="max-w-[75%]">
                  <div
                    className={`rounded-2xl px-4 py-2 text-sm 
                      ${
                        isSender ? "bg-emerald-600" : "bg-neutral-800"
                      } text-white 
                      break-words inline-block`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="rounded-md mb-2 max-w-full"
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                  </div>

                  <time className="text-xs text-zinc-400 mt-1 block text-end">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messageEndRef} />
      </div>

      {/* Fixed Footer */}
      <div className="sticky bottom-0 z-10 bg-black">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatContainer;
