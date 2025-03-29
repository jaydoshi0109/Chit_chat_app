// import { DUMMY_MESSAGES } from "../../dummy_data/dummy";
import Message from "./Message";
import useGetMessages from "../../../hooks/useGetMessages";
import useListenMessages from "../../../hooks/useListenMessages";
import useChatScroll from "../../../hooks/useChatScroll";

const Messages = () => {
  const { loading, messages } = useGetMessages();
  useListenMessages();

  const ref = useChatScroll(messages) as React.MutableRefObject<HTMLDivElement>;
  return (
    <div className="px-4 flex-1 overflow-auto" ref={ref}>
      {loading ? (
        <span className="loading loading-dots loading-lg mx-auto flex justify-center"></span>
      ) : (
        <div>
          {" "}
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {!loading && messages.length === 0 && (
            <p className="text-center text-gray-100">
              Send a Message to start conversation
            </p>
          )}
        </div>
      )}
    </div>
  );
};
export default Messages;
