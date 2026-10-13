import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiChevronDown,
  FiLayout,
  FiLogOut,
  FiShield,
  FiUser,
} from "react-icons/fi";
import BirdLogo from "../../assets/Bird.png";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  let userInfo = null;

  try {
    userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  } catch {
    userInfo = null;
  }

  const adminName = userInfo?.user?.name || "Administrator";
  const firstLetter = adminName.trim().charAt(0).toUpperCase() || "A";

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/admin/login");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-[#EAE5EF] bg-white/95 shadow-[0_2px_12px_rgba(53,32,71,0.03)] backdrop-blur-md">
      <div className="flex min-h-[76px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="flex min-w-0 items-center gap-2.5 rounded-xl text-left outline-none transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#5B3488] sm:gap-3"
          aria-label="Go to admin dashboard"
        >
          <img
            src={BirdLogo}
            alt="BIRD"
            className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
          />
        </button>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Admin Status */}
          <div className="hidden items-center gap-2 rounded-xl border border-[#EAE5EF] bg-[#FAF9FF] px-3 py-2 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1EBF8] text-[#5B3488]">
              <FiShield size={17} />
            </span>

            <span>
              <span className="block text-xs font-semibold text-[#352047]">
                Admin Access
              </span>
              <span className="mt-0.5 block text-[10px] text-[#9589A0]">
                Management panel
              </span>
            </span>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-expanded={profileOpen}
              aria-label="Open administrator menu"
              className="flex items-center gap-2 rounded-xl border border-transparent p-1.5 transition hover:border-[#EAE5EF] hover:bg-[#FAF9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B3488] sm:gap-3 sm:px-2.5 sm:py-2"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6D28D9] text-base font-bold text-white shadow-md shadow-purple-900/20">
                {firstLetter}
              </span>

              <span className="hidden max-w-[150px] text-left sm:block">
                <span className="block truncate text-sm font-semibold text-[#6D28D9]">
                  {adminName}
                </span>
                <span className="mt-0.5 block text-xs text-[#9589A0]">
                  Administrator
                </span>
              </span>

              <FiChevronDown
                size={16}
                className={`hidden text-[#82768D] transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <>
                {/* Close dropdown when clicking outside */}
                <button
                  type="button"
                  aria-label="Close administrator menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setProfileOpen(false)}
                />

                <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-[#EAE5EF] bg-white p-2 shadow-[0_12px_36px_rgba(53,32,71,0.12)]">
                  <div className="border-b border-[#F0ECF4] px-3 py-3">
                    <p className="truncate text-sm font-semibold text-[#352047]">
                      {adminName}
                    </p>
                    <p className="mt-1 text-xs text-[#9589A0]">
                      Administrator account
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/admin/users");
                    }}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#493957] transition hover:bg-[#F5F0FA] hover:text-[#5B3488]"
                  >
                    <FiLayout size={17} />
                    Users
                  </button>

                  <div className="my-1 border-t border-[#F0ECF4]" />

                  <button
                    type="button"
                    onClick={logoutHandler}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#B42336] transition hover:bg-[#FFF1F2]"
                  >
                    <FiLogOut size={17} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
