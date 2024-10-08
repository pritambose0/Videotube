import PropTypes from "prop-types";
import { timeAgoFormat } from "../utils/timeAgoFormat";
import { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";

function TweetsListPage({
  avatar,
  fullName,
  timeAgo,
  tweet,
  likes: likesCount,
  isLiked,
  tweetId,
  owner,
}) {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likesCount);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTweet, setEditTweet] = useState(tweet);

  const queryClient = useQueryClient();

  // Mutation for toggling like
  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/likes/toggle/t/${tweetId}`);
      console.log(res);

      return res.data;
    },
    onSuccess: (data) => {
      setLiked(data.data?.isLiked);
      setLikes(data.data?.likes);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error liking tweet");
      console.error("Like toggle error:", error.response?.data.message);
    },
  });

  // Mutation for updating the tweet
  const updateTweetMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch(`/tweets/${tweetId}`, {
        content: editTweet,
      });
      console.log(res);

      return res.data;
    },
    onSuccess: (data) => {
      setIsEditing(false);
      setEditTweet(data.data?.tweet);
      queryClient.invalidateQueries(["tweets"]);
      toast.success("Tweet Updated Successfully");
    },
    onError: (error) => {
      console.error("Update tweet error:", error.response?.data.message);
      toast.error(error?.response?.data?.message || "Error updating tweet");
    },
  });

  // Mutation for deleting the tweet
  const deleteTweetMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/tweets/${tweetId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tweets"]);
      toast.success("Tweet Deleted Successfully");
    },
    onError: (error) => {
      console.error("Delete tweet error:", error.response?.data.message);
      toast.error(error?.response?.data?.message || "Error deleting tweet");
    },
  });

  const handleLike = () => {
    if (tweetId) {
      likeMutation.mutate();
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setDropdownOpen(false);
  };

  const handleUpdate = () => {
    setDropdownOpen(false);
    if (editTweet?.trim()) {
      updateTweetMutation.mutate();
    }
  };

  const handleDelete = () => {
    setDropdownOpen(false);
    if (tweetId) {
      deleteTweetMutation.mutate();
    }
  };
  // console.log(editTweet);

  return (
    <>
      <Toaster />
      <div className="flex gap-3 border-b border-gray-700 md:p-1 last:border-b-transparent">
        <div className="h-14 w-14 shrink-0">
          <img
            src={avatar}
            alt={fullName}
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="w-full">
          <h4 className="mb-1 flex items-center gap-x-2">
            <span className="font-semibold">{fullName}</span>
            <span className="inline-block text-sm text-gray-400">
              {timeAgo && timeAgoFormat(timeAgo)}
            </span>
          </h4>
          {isEditing ? (
            <div className="mb-2">
              <input
                type="text"
                value={editTweet}
                onChange={(e) => setEditTweet(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded-md"
              />
              <button
                onClick={handleUpdate}
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md"
              >
                Update
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="mt-2 ml-2 px-4 py-1 bg-red-500 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p className="mb-2">{tweet}</p>
          )}
          <div className="flex gap-4">
            <button
              className="group/btn flex items-center gap-x-2 border-gray-700 px-4 py-1.5 after:content-[attr(data-like)]  focus:after:content-[attr(data-like-alt)]"
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
              className="group inline-flex items-center gap-x-1 outline-none after:content-[attr(data-dislike-count)] focus:after:content-[attr(data-dislike-count-alt)]"
              data-dislike-count=""
              data-dislike-count-alt=""
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className="h-5 w-5 text-inherit group-focus:text-[#ae7aff]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        {owner && (
          <div className="relative my-auto">
            <button
              className="text-gray-400 text-lg"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              &#8942;
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded shadow-lg">
                <button
                  className="block px-4 w-full hover:bg-gray-500 py-2 text-left text-sm text-white"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button
                  className="block px-4 py-2 w-full hover:bg-gray-500 text-left text-sm text-white"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

TweetsListPage.propTypes = {
  avatar: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  timeAgo: PropTypes.string,
  tweet: PropTypes.string.isRequired,
  likes: PropTypes.number,
  isLiked: PropTypes.bool,
  tweetId: PropTypes.string.isRequired,
  owner: PropTypes.bool,
};

export default TweetsListPage;
