import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function ChatSocketInitializer() {
  const socket = useAuthStore((state) => state.socket);
  const initializeSocketListeners = useChatStore((state) => state.initializeSocketListeners);
  const unsubscribeFromMessages = useChatStore((state) => state.unsubscribeFromMessages);

  useEffect(() => {
    if (socket) {
      initializeSocketListeners();

      // Clean up the listener when the component unmounts
      return () => {
        unsubscribeFromMessages();
      };
    }
  }, [socket, initializeSocketListeners, unsubscribeFromMessages]);

  return null; // This component doesn't render anything
}

export default ChatSocketInitializer;