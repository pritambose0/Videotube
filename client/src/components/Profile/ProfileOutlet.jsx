import ProfileCard from "./ProfileCard";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../services/axiosInstance";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function ProfileOutlet() {
  const { username } = useParams();
  const ownerUsername = useSelector((state) => state.auth.userData?.username);

  let owner = false;

  if (username === ownerUsername) {
    owner = true;
  }
  const { data: user, isLoading } = useQuery({
    queryKey: ["video", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/c/${username}`);
      return res?.data?.data;
    },
    staleTime: 1000 * 60,
    enabled: !!username,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // console.log("User", user);

  return (
    <>
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        {!isLoading ? (
          <ProfileCard
            coverPhoto={user?.coverImage?.url}
            avatar={user?.avatar?.url}
            channelName={user?.fullName}
            channelHandle={user?.username}
            isSubscribed={user?.isSubscribed}
            subscribers={user?.subscribersCount}
            subscribed={user?.subscribedToCount}
            channelId={user?._id}
            owner={owner}
          />
        ) : (
          <>
            <div className="relative min-h-[150px] w-full pt-[16.28%] bg-gray-700 animate-pulse"></div>

            <div className="px-2 sm:px-4">
              <div className="flex flex-col gap-4 pb-4 pt-6 sm:flex-row sm:items-center">
                <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full bg-gray-700 animate-pulse border-2"></span>
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-700 animate-pulse w-3/4 rounded"></div>
                  <div className="h-4 bg-gray-700 animate-pulse w-1/2 rounded"></div>
                  <div className="h-4 bg-gray-700 animate-pulse w-1/3 rounded"></div>
                </div>
                <div className="w-full bg-gray-700 animate-pulse h-10 rounded-sm sm:w-32"></div>
              </div>
              <ul className="no-scrollbar flex gap-x-2 overflow-x-auto border-b bg-[#121212] py-2">
                {[...Array(4)].map((_, index) => (
                  <li className="shrink-0" key={index}>
                    <div className="w-20 h-8 bg-gray-700 animate-pulse rounded"></div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        <Outlet />
      </section>
    </>
  );
}

export default ProfileOutlet;
