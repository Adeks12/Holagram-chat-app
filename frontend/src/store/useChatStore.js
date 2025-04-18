import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isChatOpen: false,
  unreadMessages: {},

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error("Failed to fetch users.");
      console.error("Error fetching users:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data.messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ messages: [] }); // Reset messages to an empty array
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      const newMessage = res.data.newMessage;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    } catch (error) {
      toast.error("Failed to send message.");
      console.error("Error sending message:", error);
    }
  },

  initializeSocketListeners: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error("Socket connection not established.");
      return;
    }

    // Check if the listener is already initialized to prevent duplicate listeners
    if (socket.hasListeners("newMessage")) {
      console.log("Socket listeners already initialized.");
      return;
    }

    // Subscribe to new messages
    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();

      if (selectedUser && newMessage.senderId === selectedUser._id) {
        // If the message is from the selected user, add it to the chat
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      } else {
        // Otherwise, increase the unread count for the sender
        set((state) => ({
          unreadMessages: {
            ...state.unreadMessages,
            [newMessage.senderId]: (state.unreadMessages[newMessage.senderId] || 0) + 1,
          },
        }));
      }
    });

    console.log("Socket listeners initialized.");
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error("Socket connection not established.");
      return;
    }

    // Subscribe to new messages
    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();

      if (selectedUser && newMessage.senderId === selectedUser._id) {
        // If the message is from the selected user, add it to the chat
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      } else {
        // Otherwise, increase the unread count for the sender
        set((state) => ({
          unreadMessages: {
            ...state.unreadMessages,
            [newMessage.senderId]: (state.unreadMessages[newMessage.senderId] || 0) + 1,
          },
        }));
      }
    });

    console.log("Subscribed to messages.");
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      console.log("Socket listeners removed.");
    }
  },

  setSelectedUser: (selectedUser) => {
    const { selectedUser: currentSelectedUser, unreadMessages } = get();

    if (currentSelectedUser?._id !== selectedUser?._id) {
      if (!selectedUser) {
        // Reset state when no user is selected
        set({
          selectedUser: null,
          isMessagesLoading: false,
          isChatOpen: false,
        });
        return;
      }

      // Reset unread count for the selected user and set selectedUser
      set((state) => ({
        selectedUser,
        isMessagesLoading: true,
        isChatOpen: true,
        unreadMessages: {
          ...state.unreadMessages,
          [selectedUser._id]: 0, // Reset unread count for the selected user
        },
      }));

      // Fetch messages for the selected user
      get().getMessages(selectedUser._id);
    }
  },

  setUnreadMessages: (callback) =>
    set((state) => {
      const updatedUnreadMessages = callback(state.unreadMessages);
      return {
        unreadMessages: updatedUnreadMessages || state.unreadMessages, // Fallback to the current state
      };
    }),
}));