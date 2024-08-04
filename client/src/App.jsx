import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

function App() {
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

export default App;
