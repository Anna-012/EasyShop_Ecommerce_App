import { NavLink } from "react-router-dom";
import {
  FiLayout,
  FiPackage,
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiShoppingBag,
  FiChevronRight,
  FiShield,
} from "react-icons/fi";

const AdminSidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: FiLayout,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: FiPackage,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: FiGrid,
    },
    {
      name: "Sellers",
      path: "/admin/sellers",
      icon: FiUserCheck,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: FiUsers,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: FiShoppingBag,
    },
  ];

  return (
    <aside className="flex min-h-[calc(100vh-124px)] w-64 shrink-0 flex-col self-start overflow-hidden rounded-2xl border border-[#E5D9F4] bg-white shadow-[0_8px_28px_rgba(76,29,149,0.07)]">
      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B6AAF]">
          ADMIN WORKSPACE
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin/dashboard"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-[#6D28D9] font-semibold text-white shadow-md shadow-purple-900/15"
                    : "font-medium text-[#554064] hover:bg-[#F2EAFE] hover:text-[#5B21B6]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-[#F0E7FC] text-[#6D28D9] group-hover:bg-white group-hover:text-[#5B21B6]"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.9} />
                  </span>

                  <span className="flex-1">{item.name}</span>

                  <FiChevronRight
                    size={16}
                    className={`transition-all duration-200 ${
                      isActive
                        ? "text-white/90"
                        : "translate-x-[-3px] text-[#B3A0CA] group-hover:translate-x-0 group-hover:text-[#6D28D9]"
                    }`}
                  />
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Information Card */}
      <div className="border-t border-[#EDE5F7] p-4">
        <div className="rounded-xl border border-[#E5D6F8] bg-[#F5EEFF] p-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#6D28D9] shadow-sm">
              <FiShield size={15} />
            </span>

            <span className="text-xs font-bold text-[#4C1D95]">
              Admin Workspace
            </span>
          </div>

          <p className="mt-2 text-[11px] leading-5 text-[#735A91]">
            Manage products, orders, users and sellers from one place.
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-[#6D28D9]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Management panel active
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
