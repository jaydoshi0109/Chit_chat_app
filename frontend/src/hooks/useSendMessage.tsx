import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { selectedConversation, messages, setmessages } = useConversation();

  const sendMessage = async (message: string) => {
    if (!selectedConversation) {
      return;
    }
    try {
      setLoading(true);
      const backendUrl = import.meta.env.REACT_APP_BACKEND_URL;
      const response = await fetch(
        `${backendUrl}/api/messages/send/${selectedConversation.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setmessages([...messages, data]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessage };
};

export default useSendMessage;