import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8F7FA]">
      <AdminNavbar />

      {/* Main Admin Layout */}
      <div className="mx-auto flex w-full max-w-[1920px] items-start gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:gap-7 lg:px-8">
        {/* Sidebar */}
        <div className="hidden shrink-0 md:block">
          <AdminSidebar />
        </div>

        {/* Page Content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
