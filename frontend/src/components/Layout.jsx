import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileBottomNav from "./MobileBottomNav.jsx";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</main>
          
          {/* Mobile Bottom Navigation */}
          <MobileBottomNav />
        </div>
      </div>
    </div>
  );
};
export default Layout;