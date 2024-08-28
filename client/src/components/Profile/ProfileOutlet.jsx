import ProfileCard from "./ProfileCard";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../services/axiosInstance";
import { useEffect } from "react";
function ProfileOutlet() {
  const { username } = useParams();

  const { data: user } = useQuery({
    queryKey: ["video", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/c/${username}`);
      return res?.data?.data;
    },
    staleTime: 1000 * 60,
    enabled: !!username,
  });
  // console.log("User", user);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <ProfileCard
          coverPhoto={user?.coverImage}
          avatar={user?.avatar}
          channelName={user?.fullName}
          channelHandle={user?.username}
          subscribers={user?.subscribersCount}
          subscribed={user?.subscribedToCount}
        />
        <Outlet />
      </section>
    </>
  );
}

export default ProfileOutlet;