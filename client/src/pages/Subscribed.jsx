import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import SubscribedChannelsList from "../components/SubscribedChannelsList";

function Subscribed() {
  const { username } = useParams();

  const {
    data: channels,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["subscribedToChannels", username],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `subscriptions/c/subscribed-to/${username}`
      );
      return res?.data?.data;
    },
    staleTime: Infinity,
    enabled: !!username,
  });

  if (isError) {
    toast.error(
      error?.response?.data?.message || error.message || "An error occurred."
    );
  }

  return (
    <div className="flex flex-col gap-y-4 py-4 mx-4">
      <Toaster />

      {isLoading ? (
        <div className="flex gap-3 border-b border-gray-700 p-4 last:border-b-transparent animate-pulse">
          <div className="h-14 w-14 shrink-0 bg-gray-700 rounded-full"></div>
          <div className="w-full space-y-2">
            <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
            <div className="h-3 w-1/4 bg-gray-700 rounded"></div>
            <div className="h-5 bg-gray-700 rounded"></div>
          </div>
        </div>
      ) : channels && channels.length > 0 ? (
        channels.map((channel) => (
          <SubscribedChannelsList
            key={channel._id}
            channelAvatar={channel.avatar?.url}
            channelName={channel.fullName}
            subscribers={channel.subscriberCount}
          />
        ))
      ) : (
        <div className="flex justify-center p-4">
          <div className="w-full max-w-sm text-center">
            <p className="mb-3 w-full">
              <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                <span className="inline-block w-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    ></path>
                  </svg>
                </span>
              </span>
            </p>
            <h5 className="mb-2 font-semibold">No subscriptions found</h5>
            <p>
              This channel has not <strong>subscribed</strong> to any other
              channels yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscribed;
