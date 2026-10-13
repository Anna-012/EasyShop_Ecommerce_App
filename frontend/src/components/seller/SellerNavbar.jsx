import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiChevronDown,
  FiUser,
  FiPackage,
  FiShoppingBag,
} from "react-icons/fi";

import BirdLogo from "../../assets/Bird.png";
import { AuthContext } from "../../context/AuthContext";

const SellerNavbar = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useContext(AuthContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const profileRef = useRef(null);

  const sellerName = userInfo?.user?.name || "Seller";

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
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

  const logoutHandler = () => {
    setShowDropdown(false);
    logout();
    navigate("/seller/login", { replace: true });
  };

  const navigateTo = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-purple-100 bg-white shadow-sm">
      <nav
        aria-label="Seller navigation"
        className="flex min-h-[88px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10"
      >
        {/* BIRD Branding */}
        <button
          type="button"
          onClick={() => navigateTo("/seller/dashboard")}
          aria-label="Go to seller dashboard"
          className="flex shrink-0 items-center gap-3 rounded-xl text-left transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
        >
          <img
            src={BirdLogo}
            alt="BIRD"
            className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
          />
        </button>

        {/* Profile and Logout */}
        <div className="flex items-center gap-3 sm:gap-5 lg:gap-6">
          {/* Profile dropdown */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown((previous) => !previous)}
              aria-expanded={showDropdown}
              aria-haspopup="menu"
              aria-label="Open seller account menu"
              className="group flex items-center gap-2 rounded-xl px-2 py-2 text-left transition hover:bg-purple-50 sm:gap-3 sm:px-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-200 bg-purple-100 text-base font-bold text-[#6D28D9] sm:h-12 sm:w-12">
                {sellerName.charAt(0).toUpperCase()}
              </span>

              <span className="hidden min-w-0 sm:block">
                <span className="block max-w-[180px] truncate text-sm font-semibold text-gray-900">
                  {sellerName}
                </span>

                <span className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                  <FiUser size={13} />
                  Seller account
                </span>
              </span>

              <FiChevronDown
                size={16}
                className={`hidden text-gray-400 transition duration-200 group-hover:text-[#6D28D9] sm:block ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-3 w-60 overflow-hidden rounded-xl border border-purple-100 bg-white p-2 shadow-xl shadow-purple-100/60"
              >
                <div className="border-b border-gray-100 px-3 py-3">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {sellerName}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Seller account</p>
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => navigateTo("/seller/profile")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-purple-50 hover:text-[#6D28D9]"
                >
                  <FiUser size={17} />
                  My Profile
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => navigateTo("/seller/products")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-purple-50 hover:text-[#6D28D9]"
                >
                  <FiPackage size={17} />
                  My Products
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => navigateTo("/seller/orders")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-purple-50 hover:text-[#6D28D9]"
                >
                  <FiShoppingBag size={17} />
                  My Orders
                </button>

                <div className="my-1 border-t border-gray-100" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={logoutHandler}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <FiLogOut size={17} />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <span className="hidden h-9 w-px bg-gray-200 sm:block" />

          {/* Main logout button */}
          <button
            type="button"
            onClick={logoutHandler}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-[#6D28D9] transition hover:border-[#6D28D9] hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 sm:min-h-12 sm:px-5"
          >
            <FiLogOut size={17} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default SellerNavbar;
