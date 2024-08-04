import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <>
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <Navbar />
        <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
