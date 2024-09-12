import ProfileCard from "../components/Profile/ProfileCard";
import { Outlet, useParams } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { useQuery } from "@tanstack/react-query";

function ChannelPage() {
  const { username } = useParams();
  console.log(username);

  const { data: owner } = useQuery({
    queryKey: ["owner", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/c/${username}`);
      return res.data?.data;
    },
    staleTime: Infinity,
    enabled: !!username,
  });

  // console.log(owner);

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      {owner && (
        <ProfileCard
          coverPhoto={owner.coverImage}
          avatar={owner.avatar}
          channelName={owner.fullName}
          channelHandle={owner.username}
          isSubscribed={owner.isSubscribed}
          channelId={owner._id}
          subscribers={owner.subscribersCount}
          subscribed={owner.subscribedToCount}
        />
      )}
      <Outlet />
    </section>
  );
}

export default ChannelPage;
