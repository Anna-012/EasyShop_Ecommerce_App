import { Link } from "react-router-dom";
import { MdStorefront } from "react-icons/md";
import { RiShieldUserFill } from "react-icons/ri";

const SellerAdminLinks = () => {
  return (
    <div className="hidden lg:flex items-center gap-6">
      <Link
        to="/seller/login"
        className="flex items-center gap-1 text-orange-600 font-medium hover:text-orange-700 transition-colors"
      >
        <MdStorefront size={20} />
        <span>Seller</span>
      </Link>

      <Link
        to="/admin/login"
        className="flex items-center gap-1 text-violet-600 font-medium hover:text-violet-700 transition-colors"
      >
        <RiShieldUserFill size={20} />
        <span>Admin</span>
      </Link>
    </div>
  );
};

export default SellerAdminLinks;
