import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi";

import { AuthContext } from "../../../context/AuthContext";
import { CartContext } from "../../../context/CartContext";
import logo from "../../../assets/Bird.jpg";

import API from "../../../services/api";

import SellerAdminLinks from "./SellerAdminLinks";
import ProfileDropdown from "./ProfileDropdown";
import SearchBar from "./SearchBar";
import DesktopCategories from "./DesktopCategories";
import MobileCategories from "./MobileCategories";

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState([]);

  const dropdownRef = useRef();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    fetchCategories();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/?search=${search}`);
    } else {
      navigate("/");
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/category/get-all-categories");

      setCategories(data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={logo}
              alt="logo"
              className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
            />

            <span className="font-bold text-xl text-orange-400">BIRD</span>
          </Link>

          {/* Desktop Categories */}
          <DesktopCategories categories={categories} userInfo={userInfo} />

          {/* Desktop Search */}
          <SearchBar
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
          />

          {/* Seller & Admin Links */}
          <SellerAdminLinks />

          {/* Right Section */}
          <div
            ref={dropdownRef}
            className="flex items-center gap-4 md:gap-6 relative"
          >
            {/* Profile */}
            <div
              className="flex items-center gap-1 cursor-pointer hover:text-grey-700 transition"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                {userInfo?.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <span className="hidden md:block text-sm">▼</span>
            </div>

            {/* Dropdown */}
            <ProfileDropdown
              userInfo={userInfo}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              logout={logout}
            />

            {/* Cart */}
            <Link
              to="/cart"
              className="ml-2 relative text-2xl hover:text-orange-500 transition"
            >
              <HiOutlineShoppingCart />

              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <div className="md:hidden bg-white px-4 py-3 border-b">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </form>
      </div>

      <MobileCategories categories={categories} />
    </>
  );
};

export default Navbar;
