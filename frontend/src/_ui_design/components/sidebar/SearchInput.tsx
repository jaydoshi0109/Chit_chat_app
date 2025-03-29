import { Search } from "lucide-react";
import useConversation from "../../../zustand/useConversation";
import useGetConversations from "../../../hooks/useGetConversations";
import { useState } from "react";
import toast from "react-hot-toast";
import { ConversationType } from "../../../zustand/useConversation";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search.trim()) return;

    if (search.length < 3) {
      toast.error("Search must be at least 3 characters long");
      return;
    }

    const filteredConversations = conversations.find((c: ConversationType) =>
      c.fullname.toLowerCase().includes(search.toLowerCase())
    );

    if (filteredConversations) {
      setSelectedConversation(filteredConversations);
      setSearch(""); // Clear search input
    } else {
      toast.error("No conversation found");
    }
  };

  return (
    <form className="flex items-center gap-2" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search…"
        className="input-sm md:input input-bordered rounded-full sm:rounded-full w-full"
        value={search} // Bind the state
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        className="btn md:btn-md btn-sm btn-circle bg-sky-500 text-white  "
      >
        <Search className="w-4 h-4 md:w-6 md:h-6 outline-none" />
      </button>
    </form>
  );
};
export default SearchInput;
