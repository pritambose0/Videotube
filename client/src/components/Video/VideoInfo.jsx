import PropTypes from "prop-types";
import axiosInstance from "../../services/axiosInstance";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const VideoInfo = ({
  channelImage,
  channelName,
  description,
  channelId,
  subscribers,
  subscribeStatus,
  channelUsername,
}) => {
  const [isSubscribed, setIsSubscribed] = useState(subscribeStatus);
  // console.log(isSubscribed);
  // console.log(subscribeStatus);
  const authStatus = useSelector((state) => state.auth.status);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/subscriptions/c/${channelId}`);
      return res.data;
    },
    onSuccess: (data) => {
      setIsSubscribed(data.data?.isSubscribed);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error toggling subscribe");
      console.error("Subscription toggle error:", error.response?.data.message);
    },
  });

  const handleSubscribe = () => {
    if (!authStatus) {
      toast.error("Please login");
      return;
    }
    if (channelId) {
      mutation.mutate();
    }
  };
  return (
    <>
      <div className="mt-4 flex items-center justify-between">
        <Toaster />
        <div className="flex items-center gap-x-4">
          <div className="mt-2 h-12 w-12 shrink-0">
            <img
              src={channelImage}
              alt={channelName}
              className="h-full w-full rounded-full"
            />
          </div>
          <Link to={`/c/${channelUsername}/videos`}>
            <div className="block">
              <p className="text-gray-200">{channelName}</p>
              <p className="text-sm text-gray-400">{subscribers} Subscribers</p>
            </div>
          </Link>
        </div>
        <div className="block">
          <button className="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto">
            <span className="inline-block w-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                ></path>
              </svg>
            </span>
            <span className="group-focus/btn" onClick={handleSubscribe}>
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </span>
          </button>
        </div>
      </div>
      <hr className="my-4 border-white" />
      <div className="h-5 overflow-hidden group-focus:h-auto">
        <p className="text-sm">{description}</p>
      </div>
    </>
  );
};

VideoInfo.propTypes = {
  channelImage: PropTypes.string,
  channelName: PropTypes.string,
  description: PropTypes.string,
  channelId: PropTypes.string,
  subscribers: PropTypes.number,
  subscribeStatus: PropTypes.bool,
  channelUsername: PropTypes.string,
};

export default VideoInfo;
