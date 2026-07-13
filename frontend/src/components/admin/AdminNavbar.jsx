import BirdLogo from "../../assets/Bird.jpg";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/admin/login");
  };

  return (
    <nav className="bg-white border-b shadow-sm px-8 py-4 flex justify-between items-center">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/admin/dashboard")}
      >
        <img src={BirdLogo} alt="BIRD" className="w-12 h-12 object-contain" />

        <h1 className="text-2xl font-bold">BIRD Admin</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="font-semibold">{userInfo?.user?.name}</p>

          <p className="text-sm text-gray-500">Administrator</p>
        </div>

        <button
          onClick={logoutHandler}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
