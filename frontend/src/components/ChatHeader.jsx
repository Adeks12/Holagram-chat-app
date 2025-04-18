import React from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  // Ensure selectedUser exists
  if (!selectedUser) return null;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-10 h-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || '/avatar.png'}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {Array.isArray(onlineUsers) && selectedUser?._id && onlineUsers.includes(selectedUser._id)
                ? 'online'
                : 'offline'}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
         

          {/* Close Button */}
          <button onClick={() => setSelectedUser(null)} aria-label="Close chat">
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;