import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiShoppingBag,
  FiBriefcase,
  FiShield,
  FiPackage,
  FiGrid,
  FiLogOut,
} from "react-icons/fi";

import { AuthContext } from "../../../context/AuthContext";

const ProfileDropdown = ({ userInfo: passedUserInfo, onClose }) => {
  const { userInfo: contextUserInfo, logout } = useContext(AuthContext);

  const userInfo = passedUserInfo ?? contextUserInfo;
  const user = userInfo?.user;

  const Item = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      onClick={onClose}
      className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-800"
    >
      <Icon size={16} className="shrink-0 text-purple-600" />
      <span>{children}</span>
    </Link>
  );

  const SectionLabel = ({ children }) => (
    <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
      {children}
    </p>
  );

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  const isAdmin = user?.role === "admin" || user?.isAdmin;
  const isSeller = user?.role === "seller";

  return (
    <div className="w-60 overflow-hidden rounded-xl border border-purple-100 bg-white shadow-xl shadow-purple-900/10">
      {user ? (
        <>
          {/* Compact Profile Header */}
          <div className="flex items-center gap-2.5 border-b border-purple-100 bg-purple-50/60 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
              <FiUser size={16} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-purple-900">
                {user.name || "BIRD User"}
              </p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Role-based Menu */}
          <div className="space-y-0.5 p-1.5">
            {isAdmin ? (
              <>
                <Item to="/admin/dashboard" icon={FiGrid}>
                  Admin Dashboard
                </Item>
                <Item to="/admin/products" icon={FiPackage}>
                  Manage Products
                </Item>
              </>
            ) : isSeller ? (
              <>
                <Item to="/seller/dashboard" icon={FiGrid}>
                  Seller Dashboard
                </Item>
                <Item to="/seller/products" icon={FiPackage}>
                  My Products
                </Item>
              </>
            ) : (
              <Item to="/orders" icon={FiShoppingBag}>
                My Orders
              </Item>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-purple-100 p-1.5">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Guest Header */}
          <div className="border-b border-purple-100 bg-purple-50/60 px-3 py-2.5">
            <p className="text-sm font-semibold text-purple-900">
              Welcome to BIRD
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              Sign in to your account
            </p>
          </div>

          {/* Customer */}
          <div className="space-y-0.5 p-1.5">
            <SectionLabel>Customer</SectionLabel>
            <Item to="/login" icon={FiLogIn}>
              Customer Login
            </Item>
            <Item to="/register" icon={FiUserPlus}>
              Create Account
            </Item>
          </div>

          {/* Seller */}
          <div className="border-t border-purple-100 p-1.5">
            <SectionLabel>Seller</SectionLabel>
            <Item to="/seller/login" icon={FiBriefcase}>
              Seller Login
            </Item>
            <Item to="/seller/register" icon={FiShoppingBag}>
              Seller Registration
            </Item>
          </div>

          {/* Admin */}
          <div className="border-t border-purple-100 p-1.5">
            <SectionLabel>Administration</SectionLabel>
            <Item to="/admin/login" icon={FiShield}>
              Admin Login
            </Item>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
