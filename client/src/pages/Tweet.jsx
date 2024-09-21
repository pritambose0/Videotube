import { useState } from "react";
import TweetsListPage from "../components/TweetsListPage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

function Tweet() {
  const { username } = useParams();
  const [isOpenCreateTweet, setIsOpenCreateTweet] = useState(false);
  const queryClient = useQueryClient();
  const ownerUsername = useSelector((state) => state.auth.userData?.username);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const owner = username === ownerUsername;

  const { data: tweets, isLoading } = useQuery({
    queryKey: ["tweets", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/tweets/c/${username}`);
      return res.data?.data;
    },
    staleTime: Infinity,
    enabled: !!username,
  });

  const mutation = useMutation({
    mutationFn: async (tweet) => {
      const res = await axiosInstance.post(`/tweets`, { content: tweet });
      return res.data;
    },
    onSuccess: () => {
      setIsOpenCreateTweet(false);
      queryClient.invalidateQueries(["tweets", username]);
      toast.success("Tweet Created Successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error creating tweet");
      console.log(error);
    },
  });

  const onSubmit = (data) => {
    if (data?.tweet?.trim()) {
      mutation.mutate(data.tweet);
    }
  };

  const handleCreateTweetToggle = () => {
    setIsOpenCreateTweet((prev) => !prev);
    reset();
  };

  return (
    <>
      <Toaster />
      {owner && (
        <div className="mx-auto w-full flex items-center justify-end px-5 py-3">
          <button
            className="bg-[#ae7aff] px-4 py-2 text-center font-bold text-black transition-all duration-150 ease-in-out rounded-sm inline-flex gap-2 items-center active:translate-x-[5px] active:translate-y-[5px]"
            onClick={handleCreateTweetToggle}
          >
            {!isOpenCreateTweet ? "Create Tweet" : "Close"}
          </button>
        </div>
      )}

      {isOpenCreateTweet && (
        <form
          className="mt-2 border pb-2 mx-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <textarea
            className="mb-2 h-10 w-full resize-none border-none bg-transparent px-3 pt-2 outline-none"
            placeholder="Write a tweet"
            {...register("tweet", {
              required: "Tweet is required",
              maxLength: {
                value: 280,
                message: "Tweet cannot exceed 280 characters",
              },
            })}
          ></textarea>
          {errors.tweet && (
            <p className="text-red-500">{errors.tweet.message}</p>
          )}
          <div className="flex items-center justify-end gap-x-3 px-3">
            <button
              className="bg-[#ae7aff] px-3 py-2 font-semibold text-black"
              type="submit"
            >
              {mutation.isPending ? "Creating..." : "Post"}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex gap-3 border-b border-gray-700 p-4 last:border-b-transparent animate-pulse">
          <div className="h-14 w-14 shrink-0 bg-gray-700 rounded-full"></div>
          <div className="w-full space-y-2">
            <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
            <div className="h-3 w-1/4 bg-gray-700 rounded"></div>
            <div className="h-5 bg-gray-700 rounded"></div>
            <div className="flex gap-4">
              <div className="h-6 w-10 bg-gray-700 rounded"></div>
              <div className="h-6 w-10 bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="relative my-auto">
            <div className="h-5 w-5 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      ) : tweets && tweets.length > 0 ? (
        <div className="p-4">
          <div className="flex flex-col gap-3 border-b border-gray-700 py-4 last:border-b-transparent">
            {tweets.map((tweet) => (
              <TweetsListPage
                key={tweet._id}
                avatar={tweet.owner?.avatar?.url}
                fullName={tweet.owner?.fullName}
                timeAgo={tweet.createdAt}
                tweet={tweet.content}
                likes={tweet.likesCount}
                isLiked={tweet.isLiked}
                tweetId={tweet._id}
                owner={owner}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center p-4">
          <div className="w-full max-w-sm text-center shadow-md ">
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
            <h5 className="mb-2 font-semibold">No Tweets</h5>
            <p>
              This channel has yet to make a <strong>Tweet</strong>.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Tweet;
