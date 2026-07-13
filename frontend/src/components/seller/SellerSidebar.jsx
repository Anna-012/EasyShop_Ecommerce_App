import { Link } from "react-router-dom";

const SellerSidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md p-6">
      <h2 className="text-2xl font-bold mb-8">Seller Panel</h2>

      <div className="space-y-4">
        <Link to="/seller/dashboard" className="block hover:text-blue-600">
          Dashboard
        </Link>

        <Link to="/seller/add-product" className="block hover:text-blue-600">
          Add Product
        </Link>

        <Link to="/seller/products" className="block hover:text-blue-600">
          My Products
        </Link>

        <Link to="/seller/orders" className="block hover:text-blue-600">
          Orders
        </Link>

        <Link to="/seller/profile" className="block hover:text-blue-600">
          Profile
        </Link>
      </div>
    </div>
  );
};

export default SellerSidebar;
