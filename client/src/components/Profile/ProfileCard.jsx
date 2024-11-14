import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../services/axiosInstance";
import { useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";

function ProfileCard({
  coverPhoto,
  avatar,
  channelName,
  channelHandle,
  subscribers,
  subscribed,
  channelId,
  isSubscribed: subscribeStatus,
  owner,
}) {
  const [isSubscribed, setIsSubscribed] = useState(subscribeStatus);
  const authStatus = useSelector((state) => state.auth.status);
  // console.log("ISSUBSCRIBED", isSubscribed);

  const tabs = [
    { name: "Videos", path: `/c/${channelHandle}/videos` },
    { name: "Playlists", path: `/c/${channelHandle}/playlists` },
    { name: "Tweets", path: `/c/${channelHandle}/tweets` },
    { name: "Subscribed", path: `/c/${channelHandle}/subscribed` },
  ];

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/subscriptions/c/${channelId}`);
      return res.data;
    },
    onSuccess: (data) => {
      setIsSubscribed(data.data?.isSubscribed);
    },
    onError: (error) => {
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
      <div className="relative min-h-[150px] w-full pt-[16.28%]">
        <Toaster />
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={coverPhoto}
            alt="cover-photo"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>

      <div className="px-2 sm:px-4">
        <div className="flex flex-col gap-4 pb-4 pt-6 sm:flex-row sm:items-center">
          <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
            <img
              src={avatar}
              alt="Channel"
              className="h-full w-full object-cover"
            />
          </span>
          <div className="flex-1">
            <h1 className="text-lg font-bold sm:text-xl">{channelName}</h1>
            <p className="text-sm text-gray-400">@{channelHandle}</p>
            <p className="text-sm text-gray-400">
              {subscribers || 0} Subscribers · {subscribed || 0} Subscribed
            </p>
          </div>
          {!owner && (
            <button
              className="w-full bg-[#ae7aff] px-4 py-2 text-center font-bold text-black transition-all duration-150 ease-in-out sm:w-auto rounded-sm inline-flex gap-2 items-center active:translate-x-[5px] active:translate-y-[5px] justify-center hover:bg-[#9c6de2]"
              onClick={handleSubscribe}
            >
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
              <span>{isSubscribed ? "Subscribed" : "Subscribe"}</span>
            </button>
          )}

          {owner && (
            <>
              <Link
                to={`/c/${channelHandle}/edit`}
                className="flex w-full sm:w-auto"
              >
                <button className="bg-[#ae7aff] px-4 py-2 font-bold text-black transition-transform duration-150 ease-in-out rounded-sm flex gap-2 items-center active:translate-x-[2px] active:translate-y-[2px] hover:bg-[#9c6de2]">
                  Edit Channel
                </button>
              </Link>

              <Link
                to={`/c/${channelHandle}/admin`}
                className="flex w-full sm:w-auto"
              >
                <button className="bg-[#ae7aff] px-4 py-2 font-bold text-black transition-transform duration-150 ease-in-out rounded-sm flex gap-2 items-center active:translate-x-[2px] active:translate-y-[2px] hover:bg-[#9c6de2]">
                  Dashboard
                </button>
              </Link>
            </>
          )}
        </div>
        <ul className="no-scrollbar flex gap-x-2 overflow-x-auto border-b  bg-[#121212] py-2">
          {tabs.map((tab, index) => (
            <li className="shrink-0" key={index}>
              <Link to={tab.path}>
                <button
                  className={`w-full px-3 py-1.5 border-b-2 ${
                    location.pathname === tab.path
                      ? "border-[#ae7aff] font-semibold bg-white text-[#ae7aff]"
                      : "border-transparent text-gray-400"
                  }`}
                >
                  {tab.name}
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

ProfileCard.propTypes = {
  coverPhoto: PropTypes.string,
  avatar: PropTypes.string,
  channelName: PropTypes.string,
  channelHandle: PropTypes.string,
  subscribers: PropTypes.number,
  subscribed: PropTypes.number,
  isSubscribed: PropTypes.bool,
  channelId: PropTypes.string,
  owner: PropTypes.bool,
};

export default ProfileCard;
