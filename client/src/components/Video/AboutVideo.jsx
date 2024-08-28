import PropTypes from "prop-types";
import axiosInstance from "../../services/axiosInstance";
import { useParams } from "react-router-dom";
import { useState } from "react";
import PlaylistModal from "../PlaylistModel";
import { useMutation } from "@tanstack/react-query";

const AboutVideo = ({
  title,
  views,
  timeAgo,
  likes: likesCount,
  isLiked,
  playliists,
}) => {
  function timeAgoFormat(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval === 1 ? `${interval} year ago` : `${interval} years ago`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval === 1
        ? `${interval} month ago`
        : `${interval} months ago`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? `${interval} day ago` : `${interval} days ago`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? `${interval} hour ago` : `${interval} hours ago`;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1
        ? `${interval} minute ago`
        : `${interval} minutes ago`;
    }
    return seconds <= 1 ? `${seconds} second ago` : `${seconds} seconds ago`;
  }
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likesCount);
  const { videoId } = useParams();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`likes/toggle/v/${videoId}`);
      return res.data;
    },
    onSuccess: (data) => {
      setLiked(data.data?.isLiked);
      setLikes(data.data?.likes);
    },
    onError: (error) => {
      console.error("Like toggle error:", error.response?.data.message);
    },
  });

  const handleLike = () => {
    if (videoId) {
      mutation.mutate();
    }
  };
  // console.log(isLiked);
  // console.log(liked);

  return (
    <div className="flex flex-wrap gap-y-2">
      <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="flex text-sm text-gray-200">
          {views} Views · {timeAgoFormat(timeAgo)}
        </p>
      </div>
      <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
        <div className="flex items-center justify-between gap-x-4 md:justify-end lg:justify-between xl:justify-end">
          <div className="flex overflow-hidden rounded-lg border">
            <button
              className="group/btn flex items-center gap-x-2 border-r border-gray-700 px-4 py-1.5 after:content-[attr(data-like)] hover:bg-white/10 focus:after:content-[attr(data-like-alt)]"
              data-like={likes}
              data-like-alt={likes}
              onClick={handleLike}
            >
              <span
                className={`inline-block w-5 ${
                  liked ? "text-[#ae7aff]" : "group-focus/btn:text-[#ae7aff]"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={liked ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                  ></path>
                </svg>
              </span>
            </button>
            <button
              className="group/btn flex items-center gap-x-2 px-4 py-1.5 after:content-[attr(data-like)] hover:bg-white/10 focus:after:content-[attr(data-like-alt)]"
              data-like=""
              data-like-alt=""
            >
              <span className="inline-block w-5 group-focus/btn:text-[#ae7aff]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
          <div className="relative block">
            <button className="peer flex items-center gap-x-2 rounded-lg bg-white px-4 py-1.5 text-black">
              <span className="inline-block w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                  ></path>
                </svg>
              </span>
              Playlist
            </button>
            <PlaylistModal playlists={playliists} />
          </div>
        </div>
      </div>
    </div>
  );
};

AboutVideo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  views: PropTypes.number,
  isLiked: PropTypes.bool,
  timeAgo: PropTypes.string,
  author: PropTypes.string,
  likes: PropTypes.number,
  playliists: PropTypes.array,
  onCreatePlaylist: PropTypes.func,
};

export default AboutVideo;