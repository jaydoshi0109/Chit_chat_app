import { create } from "zustand";

export type ConversationType = {
  id: string;
  fullname: string;
  profilePic: string;
};

export type MessageType = {
  id: string;
  body: string;
  senderId: string;
  createdAt: string;
};

interface ConversationState {
  selectedConversation: ConversationType | null;
  messages: MessageType[];
  setSelectedConversation: (conversation: ConversationType | null) => void;
  setmessages: (messages: MessageType[]) => void;
}

const useConversation = create<ConversationState>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (consversation) =>
    set({ selectedConversation: consversation }),
  messages: [],
  setmessages: (messages) => set({ messages }),
}));

export default useConversation;
