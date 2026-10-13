import { FiSearch } from "react-icons/fi";

const SearchBar = ({ search, setSearch, handleSearch }) => {
  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="group relative">
        <input
          type="search"
          aria-label="Search products"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-gray-200 bg-[#FAF9FF] py-2.5 pl-5 pr-12 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-purple-200 focus:border-[#6D28D9] focus:bg-white focus:ring-2 focus:ring-purple-100"
        />

        <button
          type="submit"
          aria-label="Search"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#6D28D9] transition-colors duration-200 hover:bg-purple-100 hover:text-[#4C1D95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <FiSearch size={18} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
