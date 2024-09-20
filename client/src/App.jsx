import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./store/authSlice";
import axiosInstance from "./services/axiosInstance";

function App() {
  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.auth.status);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/users/current-user")
      .then((userData) => {
        if (userData) {
          dispatch(login(userData?.data?.data));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, userStatus]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <Navbar />
        <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <Sidebar />
          <Outlet />
        </div>
        <Toaster />
      </div>
    </>
  );
}

export default App;
