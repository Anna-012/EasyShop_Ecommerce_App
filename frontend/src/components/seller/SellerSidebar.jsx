import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiPlusSquare,
  FiPackage,
  FiShoppingBag,
  FiUser,
  FiChevronRight,
} from "react-icons/fi";

const SellerSidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/seller/dashboard",
      icon: FiGrid,
    },
    {
      name: "Add Product",
      path: "/seller/add-product",
      icon: FiPlusSquare,
    },
    {
      name: "My Products",
      path: "/seller/products",
      icon: FiPackage,
    },
    {
      name: "Orders",
      path: "/seller/orders",
      icon: FiShoppingBag,
    },
    {
      name: "Profile",
      path: "/seller/profile",
      icon: FiUser,
    },
  ];

  return (
    <aside className="flex w-full flex-col rounded-2xl border border-purple-100 bg-white p-5 shadow-sm sm:p-6">
      {/* Sidebar heading */}
      <div className="mb-7 flex items-center gap-3 border-b border-gray-100 px-2 pb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#6D28D9]">
          <FiShoppingBag size={23} />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-bold tracking-tight text-gray-900">
            Seller Panel
          </h2>

          <p className="mt-1 text-sm text-gray-500">Manage your store</p>
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Seller navigation" className="flex-1">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
          Workspace
        </p>

        <div className="space-y-2">
          {menuItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/seller/dashboard"}
              className={({ isActive }) =>
                `group flex min-h-12 items-center justify-between gap-3 rounded-xl px-4 py-3 text-base transition-all duration-200 ${
                  isActive
                    ? "bg-[#6D28D9] font-semibold text-white shadow-sm shadow-purple-200"
                    : "font-medium text-gray-600 hover:bg-purple-50 hover:text-[#6D28D9]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon
                      size={20}
                      className={
                        isActive
                          ? "shrink-0 text-white"
                          : "shrink-0 text-gray-400 transition-colors group-hover:text-[#6D28D9]"
                      }
                    />

                    <span>{name}</span>
                  </span>

                  <FiChevronRight
                    size={17}
                    className={`shrink-0 transition-all duration-200 ${
                      isActive
                        ? "text-purple-200"
                        : "text-transparent group-hover:translate-x-0.5 group-hover:text-purple-300"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom information card */}
      <div className="mt-8 rounded-xl border border-purple-100 bg-[#FAF9FF] p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-[#6D28D9]">
            <FiShoppingBag size={16} />
          </div>

          <p className="text-sm font-semibold text-[#4C1D95]">BIRD Seller</p>
        </div>

        <p className="mt-2 text-xs leading-5 text-gray-500">
          Manage your products, track orders, and keep your store organized.
        </p>
      </div>
    </aside>
  );
};

export default SellerSidebar;
