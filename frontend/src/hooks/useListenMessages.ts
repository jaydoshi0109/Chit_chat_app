import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { setmessages, messages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setmessages([...messages, newMessage]);
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, setmessages, messages]);
};

export default useListenMessages;
