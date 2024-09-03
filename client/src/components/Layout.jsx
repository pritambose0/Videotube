import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <>
      <div className="h-screen w-full overflow-y-auto bg-red-500 text-white">
        <Navbar />
        <div className="flex min-h-[calc(100vh-66px)] w-screen sm:min-h-[calc(100vh-82px)]">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
