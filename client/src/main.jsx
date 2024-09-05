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
  Tweet,
  VideoPage,
} from "./pages";
import AuthLayout from "./components/AuthLayout.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ChannelPage from "./components/ChannelPage.jsx";
import EditChannel from "./pages/EditChannel.jsx";

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
        path: "/c/:username/liked-videos",
        element: (
          <AuthLayout authentication={false}>
            <LikedVideos />,
          </AuthLayout>
        ),
      },
      {
        path: "/c/:username",
        element: (
          <AuthLayout authentication={false}>
            <ChannelPage />,
          </AuthLayout>
        ),
      },
      {
        path: "/videos/:videoId",
        element: (
          <AuthLayout authentication={false}>
            <VideoPage />,
          </AuthLayout>
        ),
      },
      {
        path: "/c/:username/history",
        element: (
          <AuthLayout authentication={false}>
            <History />,
          </AuthLayout>
        ),
      },
      {
        path: "/c/:username",
        element: (
          <AuthLayout authentication={false}>
            <ProfileOutlet />,
          </AuthLayout>
        ),
        children: [
          {
            path: "/c/:username/videos",
            element: (
              <AuthLayout authentication={false}>
                <MyChannel />,
              </AuthLayout>
            ),
          },
          {
            path: "/c/:username/playlists",
            element: (
              <AuthLayout authentication={false}>
                <Playlists />,
              </AuthLayout>
            ),
          },
          {
            path: "/c/:username/tweets",
            element: (
              <AuthLayout authentication={false}>
                <Tweet />,
              </AuthLayout>
            ),
          },
          {
            path: "/c/:username/subscribed",
            element: (
              <AuthLayout authentication={false}>
                <Subscribed />,
              </AuthLayout>
            ),
          },
          {
            path: "/c/:username/edit",
            element: (
              <AuthLayout authentication={true}>
                <EditChannel />
              </AuthLayout>
            ),
          },
        ],
      },
      // {
      //   path: "/c/:username/edit",
      //   element: (
      //     <AuthLayout authentication={true}>
      //       <EditChannel />
      //     </AuthLayout>
      //   ),
      //   children: [
      //     {
      //       path: "/c/:username/edit/personal-info",
      //       element: (
      //         <AuthLayout authentication={true}>
      //           <EditChannel />
      //         </AuthLayout>
      //       ),
      //     },
      //     {
      //       path: "/c/:username/edit/channel-info",
      //       element: (
      //         <AuthLayout authentication={true}>
      //           <EditChannelInfo />
      //         </AuthLayout>
      //       ),
      //     },
      //   ],
      // },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </Provider>
  // </React.StrictMode>
);
