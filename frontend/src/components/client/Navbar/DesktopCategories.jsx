import { Link } from "react-router-dom";

const DesktopCategories = ({ categories, userInfo }) => {
  return (
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
  );
};

export default DesktopCategories;
