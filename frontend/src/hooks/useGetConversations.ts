import { useEffect, useState } from "react";
import { ConversationType } from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationType[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

        const response = await fetch(`${backendUrl}/api/messages/conversations`, {
          method: "GET",
          credentials: "include", // ✅ needed if you're using cookies
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch conversations");
        }

        setConversations(data);
      } catch (error: any) {
        console.error("Error fetching conversations:", error);
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  return { loading, conversations };
};

export default useGetConversations;
