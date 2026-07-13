import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { HiMenu, HiX, HiOutlineShoppingCart } from "react-icons/hi";

import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import logo from "../../assets/Bird.jpg";
import API from "../../services/api";

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Category");

  const dropdownRef = useRef();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const filters = [
    "Category",
    "Brand",
    "Price",
    "Rating",
    "Availability",
    "Discount",
    "Sort",
  ];

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

    setIsMenuOpen(false);
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
          <div className="hidden lg:flex items-center gap-6 font-medium text-sm">
            {userInfo?.isAdmin ? (
              <>
                <Link to="/admin/dashboard" className="hover:text-orange-500">
                  Dashboard
                </Link>

                <Link to="/admin/products" className="hover:text-orange-500">
                  Products
                </Link>

                <Link to="/admin/orders" className="hover:text-orange-500">
                  Orders
                </Link>
              </>
            ) : (
              <>
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/?category=${category.title}`}
                    className="hover:text-orange-500"
                  >
                    {category.title}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:block flex-1 max-w-md mx-6"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </form>
          {/* Right Section */}
          <div
            ref={dropdownRef}
            className="flex items-center gap-4 md:gap-6 relative"
          >
            {/* Profile */}
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                {userInfo?.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <span className="hidden md:block text-xs">Profile</span>
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute top-14 right-0 w-60 bg-white rounded-lg shadow-lg border p-4 z-50">
                {userInfo ? (
                  <>
                    <p className="font-semibold">{userInfo.user.name}</p>

                    <p className="text-xs text-gray-500 mb-3">
                      {userInfo.user.email}
                    </p>

                    <hr className="mb-3" />

                    {!userInfo.user.isAdmin && (
                      <Link
                        to="/orders"
                        className="block py-2 hover:text-orange-500"
                        onClick={() => setShowDropdown(false)}
                      >
                        My Orders
                      </Link>
                    )}

                    {userInfo.user.isAdmin && (
                      <>
                        <Link
                          to="/admin/dashboard"
                          className="block py-2 hover:text-orange-500"
                          onClick={() => setShowDropdown(false)}
                        >
                          Dashboard
                        </Link>

                        <Link
                          to="/admin/products"
                          className="block py-2 hover:text-orange-500"
                          onClick={() => setShowDropdown(false)}
                        >
                          Manage Products
                        </Link>
                      </>
                    )}

                    <hr className="my-3" />

                    <Link
                      to="/seller/login"
                      className="block py-2 hover:text-orange-500"
                      onClick={() => setShowDropdown(false)}
                    >
                      Seller Login
                    </Link>

                    <Link
                      to="/admin/login"
                      className="block py-2 hover:text-orange-500"
                      onClick={() => setShowDropdown(false)}
                    >
                      Admin Login
                    </Link>

                    <button
                      onClick={logout}
                      className="mt-3 text-red-500 hover:text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block py-2 hover:text-orange-500"
                      onClick={() => setShowDropdown(false)}
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="block py-2 hover:text-orange-500"
                      onClick={() => setShowDropdown(false)}
                    >
                      Signup
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-2xl hover:text-orange-500 transition"
            >
              <HiOutlineShoppingCart />

              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-3xl"
            >
              {isMenuOpen ? <HiX /> : <HiMenu />}
            </button>
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

      <div className="lg:hidden overflow-x-auto whitespace-nowrap px-4 py-3 border-b">
        <div className="flex gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/?category=${category.title}`}
              className="text-sm font-medium hover:text-orange-500"
            >
              {category.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-md">
          <div className="px-5 py-5 flex flex-col gap-4">
            {/* Admin Links */}
            {userInfo?.user?.isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="py-2 border-b hover:text-orange-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>

                <Link
                  to="/admin/products"
                  className="py-2 border-b hover:text-orange-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>

                <Link
                  to="/admin/orders"
                  className="py-2 border-b hover:text-orange-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
