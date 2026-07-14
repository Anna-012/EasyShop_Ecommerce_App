import { HiSearch } from "react-icons/hi";

const SearchBar = ({ search, setSearch, handleSearch }) => {
  return (
    <form
      onSubmit={handleSearch}
      className="hidden md:block flex-1 max-w-md mx-6"
    >
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-full px-5 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
        >
          <HiSearch size={18} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
