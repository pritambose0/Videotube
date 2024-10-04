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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          width="100"
          height="100"
        >
          <circle
            fill="#AE7AFF"
            stroke="#AE7AFF"
            strokeWidth="2"
            r="5"
            cx="20"
            cy="25"
          >
            <animate
              attributeName="cy"
              calcMode="spline"
              dur="2s"
              values="25;45;25"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin="-.9s"
            />
          </circle>
          <circle
            fill="#AE7AFF"
            stroke="#AE7AFF"
            strokeWidth="2"
            r="5"
            cx="50"
            cy="25"
          >
            <animate
              attributeName="cy"
              calcMode="spline"
              dur="2s"
              values="25;45;25"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin="-.2s"
            />
          </circle>
          <circle
            fill="#AE7AFF"
            stroke="#AE7AFF"
            strokeWidth="2"
            r="5"
            cx="80"
            cy="25"
          >
            <animate
              attributeName="cy"
              calcMode="spline"
              dur="2s"
              values="25;45;25"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin="0s"
            />
          </circle>
        </svg>
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
