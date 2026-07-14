import { Link } from "react-router-dom";

const ProfileDropdown = ({
  userInfo,
  showDropdown,
  setShowDropdown,
  logout,
}) => {
  if (!showDropdown) return null;

  return (
    <div className="absolute top-14 right-0 w-60 bg-white rounded-lg shadow-lg border p-4 z-50">
      {userInfo ? (
        <>
          <p className="font-semibold">{userInfo.user.name}</p>

          <p className="text-xs text-gray-500 mb-3">{userInfo.user.email}</p>

          <hr className="mb-3" />

          {!userInfo.user.isAdmin && (
            <Link
              to="/orders"
              className="block py-2 hover:text-orange-500"
              onClick={() => setShowDropdown(false)}
            >
              My Orders
            </Link>
          )}

          {userInfo.user.isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                className="block py-2 hover:text-orange-500"
                onClick={() => setShowDropdown(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/admin/products"
                className="block py-2 hover:text-orange-500"
                onClick={() => setShowDropdown(false)}
              >
                Manage Products
              </Link>
            </>
          )}

          <hr className="my-3" />

          <button
            onClick={logout}
            className="mt-3 text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="block py-2 hover:text-orange-500"
            onClick={() => setShowDropdown(false)}
          >
            Login
          </Link>

          <Link
            to="/register"
            className="block py-2 hover:text-orange-500"
            onClick={() => setShowDropdown(false)}
          >
            Signup
          </Link>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
