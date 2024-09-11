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
            subscribers={user?.subscribersCount}
            subscribed={user?.subscribedToCount}
            owner={owner}
          />
        ) : (
          <>
            <div className="relative min-h-[150px] w-full pt-[16.28%] bg-gray-800 animate-pulse"></div>

            <div className="px-2">
              <div className="flex flex-wrap gap-4 pb-4 pt-6">
                <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full bg-gray-700 animate-pulse"></span>
                <div className="mr-auto inline-block">
                  <div className="h-6 w-36 bg-gray-700 animate-pulse rounded mb-2"></div>
                  <div className="h-4 w-28 bg-gray-700 animate-pulse rounded mb-1"></div>
                  <div className="h-4 w-48 bg-gray-700 animate-pulse rounded"></div>
                </div>
                <div className="inline-block">
                  <div className="h-10 w-[145px] bg-gray-700 animate-pulse rounded"></div>
                </div>
              </div>
              <ul className="flex flex-row gap-x-2 border-b-2 border-gray-400 bg-[#121212] py-2">
                {[...Array(4)].map((_, index) => (
                  <li key={index} className="w-full">
                    <div className="h-8 w-full bg-gray-700 animate-pulse rounded"></div>
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
