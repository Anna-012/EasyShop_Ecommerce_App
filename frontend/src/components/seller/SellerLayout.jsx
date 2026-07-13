import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

const SellerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <SellerNavbar />

      <div className="flex">
        <SellerSidebar />

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

export default SellerLayout;
