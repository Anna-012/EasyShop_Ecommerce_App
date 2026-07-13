import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      name: "Products",
      path: "/admin/products",
    },
    {
      name: "Categories",
      path: "/admin/categories",
    },
    {
      name: "Sellers",
      path: "/admin/sellers",
    },
    {
      name: "Users",
      path: "/admin/users",
    },
    {
      name: "Orders",
      path: "/admin/orders",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>

      <div className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${
                isActive ? "bg-black text-white" : "hover:bg-gray-100"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default AdminSidebar;
