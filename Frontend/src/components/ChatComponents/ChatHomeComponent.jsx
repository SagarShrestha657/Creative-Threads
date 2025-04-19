import React from "react";
import { useChatStore } from "../../store/useChatStore";
import ChatSideBar from "./ChatSideBarComponent";
import NoChatSelected from "./NoChatSelectedComponent";
import ChatContainer from "./ChatContainer";

const ChatHomeComponent = () => {
  const selectedUser = useChatStore((state) => state.selectedUser); // ✅ Only subscribe to selectedUser
  return (
    <>
      <div className="bg-black min-h-screen text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-screen border border-neutral-200/20 bg-black rounded-lg">
            <ChatSideBar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHomeComponent;
