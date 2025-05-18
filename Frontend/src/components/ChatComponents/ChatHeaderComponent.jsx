import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { MoreVertical, X } from "lucide-react";
import { useNavigate } from "react-router-dom";


const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUser, authUser } = useAuthStore();
  const navigate = useNavigate();
  return (
    <>
      <div className="p-4 border-b border-neutral-200/20 flex items-center justify-between  ">
        <div className="flex items-center">
          <img
            src={selectedUser.profilePic}
            alt={selectedUser.username}
            className="w-10 h-10 rounded-full object-cover"
            onClick={() => {
              if (selectedUser._id === authUser._id) {
                navigate(`/profile/${selectedUser._id}`);
              } else {
                navigate(`/otheruserprofile/${selectedUser.username}`);
              }
            }}
          />
          <div className="ml-4">
            <h3 className="font-semibold">
              {selectedUser.username.charAt(0).toUpperCase() +
                selectedUser.username.slice(1)}
            </h3>

            <p className="text-sm text-gray-400">
              {selectedUser.role.charAt(0).toUpperCase() +
                selectedUser.role.slice(1)}{" "}
              • Online
            </p>
          </div>
        </div>
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </>
  );
};

export default ChatHeader;
