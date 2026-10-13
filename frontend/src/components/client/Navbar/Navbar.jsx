import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FiChevronDown, FiSearch } from "react-icons/fi";

import { AuthContext } from "../../../context/AuthContext";
import { CartContext } from "../../../context/CartContext";
import logo from "../../../assets/Bird.png";

import ProfileDropdown from "./ProfileDropdown";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { userInfo } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const totalItems = cartItems.reduce(
    (total, item) => total + (Number(item.qty) || 0),
    0,
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const query = search.trim();

    if (query) {
      navigate(`/?${new URLSearchParams({ search: query }).toString()}`);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-purple-100 bg-white shadow-sm">
      <nav
        aria-label="Main navigation"
        className="w-full px-5 sm:px-8 lg:px-10"
      >
        <div className="relative flex min-h-[72px] items-center justify-between">
          {/* BIRD Logo */}
          <Link
            to="/"
            aria-label="BIRD home"
            className="flex shrink-0 items-center justify-center rounded-xl transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <img
              src={logo}
              alt="BIRD"
              className="h-[62px] w-[62px] shrink-0 object-contain sm:h-[68px] sm:w-[68px]"
            />
          </Link>

          {/* Desktop Search */}
          <div className="absolute left-1/2 top-1/2 hidden w-[min(40vw,560px)] -translate-x-1/2 -translate-y-1/2 md:block">
            <SearchBar
              search={search}
              setSearch={setSearch}
              handleSearch={handleSearch}
            />
          </div>

          {/* Profile and Cart */}
          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5">
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                aria-label="Toggle account menu"
                aria-haspopup="true"
                aria-expanded={showDropdown}
                onClick={() => setShowDropdown((previous) => !previous)}
                className="flex items-center gap-1.5 rounded-full p-1 transition hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-[#4C1D95] ring-1 ring-purple-200">
                  {userInfo?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>

                <FiChevronDown
                  className={`hidden text-[#6D28D9] transition-transform sm:block ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                  size={17}
                />
              </button>

              {/* Dropdown is only mounted while open */}
              {showDropdown && (
                <div className="absolute right-0 top-full z-[60] mt-2">
                  <ProfileDropdown
                    userInfo={userInfo}
                    onClose={() => setShowDropdown(false)}
                  />
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label={`Shopping cart, ${totalItems} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-2xl text-[#4C1D95] transition hover:bg-purple-50 hover:text-[#6D28D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <HiOutlineShoppingCart />

              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-[#6D28D9] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-full border border-purple-100 bg-[#FAF9FF] py-2.5 pl-4 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#6D28D9] focus:bg-white focus:ring-2 focus:ring-purple-100"
            />

            <button
              type="submit"
              aria-label="Submit search"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#6D28D9] transition hover:bg-purple-100"
            >
              <FiSearch size={18} />
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
