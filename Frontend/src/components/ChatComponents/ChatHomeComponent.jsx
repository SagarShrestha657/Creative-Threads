import React from "react";
import { useChatStore } from "../../store/useChatStore";
import ChatSideBar from "./ChatSideBarComponent";
import NoChatSelected from "./NoChatSelectedComponent";
import ChatContainer from "./ChatContainer";

const ChatHomeComponent = () => {
  const selectedUser = useChatStore((state) => state.selectedUser); // ✅ Only subscribe to selectedUser
  return (
    <>
      <div className="bg-black min-h-screen mt-10 mb-10 text-white sm:mt-10 sm:mb-10 md:mt-10 md:mb-10 lg:mt-1 lg:mb-1">
        <div className="w-full">
          <div className="flex h-screen border border-neutral-200/20 bg-black rounded-lg">
            {/* Sidebar */}
            <div
              className={`${
                selectedUser ? "hidden sm:block" : ""
              } w-full sm:w-1/3 lg:w-1/4`}
            >
              <ChatSideBar />
            </div>

            {/* Chat Container */}
            <div
              className={`${
                selectedUser ? "block w-full" : "hidden sm:block"
              } flex-1`}
            >
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHomeComponent;
