import React, { useEffect } from "react";
import Sidebarskeleton from "../skeletons/SideBarSkeleton";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

const ChatSideBar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } = useChatStore()
  const {onlineUsers} = useAuthStore();
    useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUserLoading) return <Sidebarskeleton />;
  // console.log(selectedUser);
  
  return (
    <>
      <div
        className={`w-96 border-r border-neutral-200/20 flex flex-col md:block`}
      >
        <div className="p-4 border-b border-neutral-200/20">
          <input
            type="search"
            placeholder="Search conversations..."
            className="w-full px-4 py-2 pl-10 bg-black border border-neutral-200/20 rounded-lg text-white placeholder-gray-400"
          />
        </div>
        <div className="flex flex-col overflow-y-auto">
          {users.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 border-b border-neutral-200/20 cursor-pointer hover:bg-neutral-800 ${
                selectedUser?._id === user._id ? "bg-neutral-900" : ""
              }`}
            >
              <div className="flex items-center">
                <img
                  src={user.profilePic}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4 flex-1 text-left">
                  <h3 className="font-semibold">{user.username}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {user.lastMessage}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatSideBar;
