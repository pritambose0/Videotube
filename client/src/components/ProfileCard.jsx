import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
function ProfileCard({
  coverPhoto,
  channelPhoto,
  channelName,
  channelHandle,
  subscribers,
  subscribed,
}) {
  const location = useLocation();
  const tabs = [
    { name: "Videos", path: "/c/videos" },
    { name: "Playlists", path: "/c/playlists" },
    { name: "Tweets", path: "/c/tweets" },
    { name: "Subscribed", path: "/c/subscribed" },
  ];

  return (
    <>
      <div className="relative min-h-[150px] w-full pt-[16.28%]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={coverPhoto}
            alt="cover-photo"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-4 pb-4 pt-6">
          <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
            <img src={channelPhoto} alt="Channel" className="h-full w-full" />
          </span>
          <div className="mr-auto inline-block">
            <h1 className="font-bold text-xl">{channelName}</h1>
            <p className="text-sm text-gray-400">@{channelHandle}</p>
            <p className="text-sm text-gray-400">
              {subscribers} Subscribers · {subscribed} Subscribed
            </p>
          </div>
          <div className="inline-block">
            <div className="inline-flex min-w-[145px] justify-end">
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
                <span className="group-focus/btn:hidden">Subscribe</span>
                <span className="hidden group-focus/btn:block">Subscribed</span>
              </button>
            </div>
          </div>
        </div>
        <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
          {tabs.map((tab, index) => (
            <li className="w-full" key={index}>
              <Link to={tab.path}>
                <button
                  className={`w-full border-b-2 px-3 py-1.5 ${
                    location.pathname === tab.path
                      ? "border-[#ae7aff] bg-white text-[#ae7aff]"
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
  channelPhoto: PropTypes.string,
  channelName: PropTypes.string,
  channelHandle: PropTypes.string,
  subscribers: PropTypes.string,
  subscribed: PropTypes.string,
};
export default ProfileCard;
