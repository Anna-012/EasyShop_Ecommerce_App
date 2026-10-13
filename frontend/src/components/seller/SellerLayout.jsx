import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

const SellerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FAF9FF]">
      {/* Full-width navbar */}
      <SellerNavbar />

      {/* Sidebar and main content */}
      <div className="mx-auto flex w-full max-w-[1920px] items-start gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:gap-7 lg:px-8">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 self-stretch md:block">
          <div className="sticky top-[112px]">
            <SellerSidebar />
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default SellerLayout;
