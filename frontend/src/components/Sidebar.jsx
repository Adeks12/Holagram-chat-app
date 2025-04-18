import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    unreadMessages,
    setUnreadMessages,
  } = useChatStore();
  const { onlineUsers, authUser: currentUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [bouncingUserId, setBouncingUserId] = useState(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = useChatStore.getState();

      // If message is NOT from the selected user OR you're not on their chat
      if (!selectedUser || newMessage.senderId !== selectedUser._id) {
        setUnreadMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));

        setBouncingUserId(newMessage.senderId);

        // Clear bounce after 1 second
        setTimeout(() => {
          setBouncingUserId(null);
        }, 1000);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [setUnreadMessages]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);

    // Reset unread count for the selected user
    setUnreadMessages((prev) => ({
      ...prev,
      [user._id]: 0,
    }));
  };

  const chatsWithUnreadMessages = Object.keys(unreadMessages).filter(
    (userId) => unreadMessages[userId] > 0
  ).length;

  const filteredUsers = users.filter((user) => {
    if (user._id === currentUser._id) return false; // Skip current user
    if (showUnreadOnly && !unreadMessages[user._id]) return false;
    if (showOnlineOnly && !onlineUsers.includes(user._id)) return false;
    return true;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show unread only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({chatsWithUnreadMessages} chats)
          </span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => handleUserSelect(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />

              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}

              {unreadMessages[user._id] > 0 && (
                <span
                  className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full ring-2 ring-white animate-bounce"
                >
                  {unreadMessages[user._id]}
                </span>
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "online" : "offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
