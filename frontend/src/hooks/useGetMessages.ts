import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setmessages, selectedConversation } = useConversation();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation?.id) return;

      try {
        setLoading(true);
        setmessages([]);

        const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

        const response = await fetch(
          `${backendUrl}/api/messages/${selectedConversation.id}`,
          {
            credentials: "include", // Important if using cookies for auth
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch messages");
        }

        setmessages(data);
      } catch (error: any) {
        console.error("Error fetching messages:", error);
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation, setmessages]);

  return { loading, messages };
};

export default useGetMessages;
