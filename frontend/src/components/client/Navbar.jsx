import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import logo from "../../assets/Bird.jpg";

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
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
    }
  };
  // console.log("USERINFO", userInfo);
  return (
    <nav className="flex items-center justify-between px-8 h-16 border-b bg-white shadow-sm">
      {/* LEFT */}
      <Link to="/" className="flex items-center gap-3">
        <img src={logo} alt="logo" className="w-9 h-9" />
        <span className="font-bold text-xl tracking-wide">BIRD</span>
      </Link>

      {/* CENTER */}
      <div className="flex items-center gap-8 font-medium text-sm">
        {userInfo?.isAdmin ? (
          <>
            <Link className="hover:text-pink-500" to="/admin/dashboard">
              Dashboard
            </Link>
            <Link className="hover:text-pink-500" to="/admin/products">
              Products
            </Link>
            <Link className="hover:text-pink-500" to="/admin/orders">
              Orders
            </Link>
          </>
        ) : (
          <>
            <Link className="hover:text-pink-500" to="/">
              MEN
            </Link>
            <Link className="hover:text-pink-500" to="/">
              WOMEN
            </Link>
            <Link className="hover:text-pink-500" to="/">
              KIDS
            </Link>
            <Link className="hover:text-pink-500" to="/">
              HOME
            </Link>
          </>
        )}
      </div>
      {/* SEARCH */}
      <form onSubmit={handleSearch} className="w-1/3">
        <input
          type="text"
          placeholder="Search for products, brands and more"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
        />
      </form>

      <div ref={dropdownRef} className="flex items-center gap-6 relative">
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
            {userInfo?.user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs">Profile</span>
        </div>

        {/* DROPDOWN */}
        {showDropdown && (
          <div className="absolute top-14 right-0 w-56 bg-white border shadow-lg rounded-md p-4 z-50">
            {/* USER INFO */}
            {userInfo ? (
              <>
                <p className="font-semibold text-sm">{userInfo?.user?.name}</p>
                <p className="text-xs text-gray-500 mb-3">
                  {userInfo?.user?.email}
                </p>

                <hr className="mb-3" />

                {/* USER OPTIONS */}
                {!userInfo?.user?.isAdmin && (
                  <Link
                    to="/orders"
                    className="block text-sm py-1 hover:text-pink-500"
                  >
                    My Orders
                  </Link>
                )}

                {/* ADMIN OPTIONS */}
                {userInfo?.user?.isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="block text-sm py-1 hover:text-pink-500"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/products"
                      className="block text-sm py-1 hover:text-pink-500"
                    >
                      Manage Products
                    </Link>
                  </>
                )}

                <hr className="my-3" />

                {/* LOGOUT */}
                <button onClick={logout} className="text-red-500 text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-sm mb-2">
                  Login
                </Link>
                <Link to="/register" className="block text-sm">
                  Signup
                </Link>
              </>
            )}
          </div>
        )}

        {/* CART */}
        <Link to="/cart" className="relative">
          <span>Bag</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1 rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
