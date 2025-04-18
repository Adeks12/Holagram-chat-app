import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageSkeleton from './skeletons/MessageSkeleton';
import MessageInput from './MessageInput';
import { useAuthStore } from '../store/useAuthStore';

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <div className="flex-1 flex items-center justify-center text-gray-500">
          No messages yet. Start the conversation!
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6"
      >
        {Array.isArray(messages) &&
          messages.map((message) => {
            const isSender = message.senderId === authUser._id;
            return (
              <div
                key={message._id}
                className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}
              >
                {/* Avatar */}
                <div className="chat-image avatar">
                  <div className="w-10 h-10 rounded-full border border-base-300 shadow-sm">
                    <img
                      src={
                        isSender
                          ? authUser.profilePic || '/avatar.png'
                          : selectedUser?.profilePic || '/avatar.png'
                      }
                      alt="profile"
                    />
                  </div>
                </div>
                {/* Time */}
                <div className="chat-header opacity-70 mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {new Date(message.createdAt).toLocaleTimeString(['en-US'], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </time>
                </div>
                {/* Bubble */}
                <div className="chat-bubble flex flex-col max-w-xs md:max-w-sm rounded-3xl p-4">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="attachment"
                      className="rounded-md mb-2 max-w-full"
                    />
                  )}
                  {message.text && <p className="text-sm">{message.text}</p>}
                </div>
              </div>
            );
          })}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;