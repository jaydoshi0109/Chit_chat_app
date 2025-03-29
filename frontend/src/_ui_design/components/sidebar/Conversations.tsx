import Conversation from "./Conversation";
import useGetConversations from "../../../hooks/useGetConversations";

const Conversations = () => {
  const { loading, conversations } = useGetConversations();

  return (
    <div className="py-2 flex flex-col overflow-auto">
      {conversations.map((conversation) => (
        <Conversation key={conversation.id} conversation={conversation} />
      ))}
      {loading ? (
        <span className="loading loading-dots loading-lg mx-auto"></span>
      ) : null}
    </div>
  );
};
export default Conversations;
