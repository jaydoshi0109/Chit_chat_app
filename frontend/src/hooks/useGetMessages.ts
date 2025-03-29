import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setmessages, selectedConversation } = useConversation();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setmessages([]);
        const backendUrl = import.meta.env.REACT_APP_BACKEND_URL;
        const response = await fetch(
          `${backendUrl}/api/messages/${selectedConversation?.id}`
        );
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setmessages(data);
      } catch (error: any) {
        console.error("Error fetching messages:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedConversation, setmessages]);

  return { loading, messages };
};

export default useGetMessages;