import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { getCurrentUser } from "./services/api";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData.data?.data));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
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
