import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Home,
  LikedVideos,
  History,
  MyChannel,
  Playlists,
  ProfileOutlet,
  Subscribed,
  Login,
  Signup,
  Channel,
  Tweet,
} from "./pages";
import AuthLayout from "./components/AuthLayout.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />,
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />,
          </AuthLayout>
        ),
      },
      {
        path: "/liked-videos",
        element: (
          <AuthLayout authentication={false}>
            <LikedVideos />,
          </AuthLayout>
        ),
      },

      {
        path: "/channel/:id",
        element: (
          <AuthLayout authentication={false}>
            <Channel />,
          </AuthLayout>
        ),
      },
      {
        path: "/history",
        element: (
          <AuthLayout authentication={false}>
            <History />,
          </AuthLayout>
        ),
      },
      {
        path: "/c",
        element: (
          <AuthLayout authentication={true}>
            <ProfileOutlet />,
          </AuthLayout>
        ),
        children: [
          {
            path: "/c/videos",
            element: (
              <AuthLayout authentication={false}>
                <MyChannel />,
              </AuthLayout>
            ),
          },
          {
            path: "/c/playlists",
            element: (
              <AuthLayout authentication={false}>
                <Playlists />,
              </AuthLayout>
            ),
          },
          {
            path: "/c/tweets",
            element: (
              <AuthLayout authentication={false}>
                <Tweet />,
              </AuthLayout>
            ),
          },
          {
            path: "/c/subscribed",
            element: (
              <AuthLayout authentication={false}>
                <Subscribed />,
              </AuthLayout>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // </React.StrictMode>
);
