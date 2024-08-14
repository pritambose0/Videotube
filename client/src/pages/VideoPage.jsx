import axiosInstance from "../services/axiosInstance";
import { useParams } from "react-router-dom";
import AboutVideo from "../components/AboutVideo";
import VideoInfo from "../components/VideoInfo";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import Comment from "../components/Comment";
import { timeAgoFormat } from "../utils/timeAgoFormat";

function VideoPage() {
  const { videoId } = useParams();
  const userId = useSelector((state) => state.auth.userData?._id);

  // Fetch video data
  const { data: video } = useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/videos/${videoId}`);
      return res?.data?.data;
    },
    staleTime: 1000 * 60, // Cache data for 1 minute
    enabled: !!videoId, // Only run the query if videoId is defined
  });

  // Fetch playlists data
  const { data: playlists } = useQuery({
    queryKey: ["playlists", userId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/playlists/user/${userId}`);
      return res?.data?.data || [];
    },
    staleTime: 1000 * 60,
    enabled: !!userId,
  });

  // Fetch comments data
  const { data: comments } = useQuery({
    queryKey: ["comments", videoId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/comments/${videoId}`);
      return res?.data?.data;
    },
    staleTime: 1000 * 60,
  });

  // console.log(video);

  const handleClick = () => {};
  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0">
      <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
        <div className="col-span-12 w-full">
          <div className="relative mb-4 w-full pt-[56%]">
            <div className="absolute inset-0">
              <video className="h-full w-full" controls>
                <source src={video?.videoFile?.url} type="video/mp4" />
              </video>
            </div>
          </div>
          <div
            className="group mb-4 w-full rounded-lg border p-4 duration-200 hover:bg-white/5 focus:bg-white/5"
            role="button"
            tabIndex="0"
          >
            <AboutVideo
              title={video?.title}
              views={video?.views}
              timeAgo={video?.createdAt}
              likes={video?.likesCount || 0}
              isLiked={video?.isLiked}
              playliists={playlists}
            />

            <div onClick={handleClick}>
              <VideoInfo
                channelImage={video?.thumbnail?.url}
                channelName={video && video?.owner && video?.owner.fullName}
                description={video?.description}
                channelId={video?.owner && video?.owner?._id}
                subscribers={video?.owner && video?.owner.subscriberCount}
                subscribeStatus={video?.owner && video?.owner.isSubscribed}
              />
            </div>
          </div>

          <button className="peer w-full rounded-lg border p-4 text-left duration-200 hover:bg-white/5 focus:bg-white/5 sm:hidden">
            <h6 className="font-semibold">{comments?.length || 0} Comments</h6>
          </button>
          <div className="fixed inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border bg-[#121212] p-4 duration-200 hover:top-[67px] peer-focus:top-[67px] sm:static sm:h-auto sm:max-h-[500px] lg:max-h-none">
            <div className="block">
              <h6 className="mb-4 font-semibold">
                {comments?.length || 0} Comments
              </h6>
              <input
                type="text"
                className="w-full rounded-lg border bg-transparent px-2 py-1 placeholder-white"
                placeholder="Add a Comment"
              />
            </div>
            <hr className="my-4 border-white" />

            <div>
              {comments?.map((comment) => (
                <Comment
                  key={comment._id}
                  ownerAvatar={comment.owner?.avatar}
                  comment={comment.content}
                  timeAgo={timeAgoFormat(comment.createdAt)}
                  fullName={comment.owner?.fullName}
                  username={comment.owner?.username}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-12 flex w-full shrink-0 flex-col gap-3 lg:w-[350px] xl:w-[400px]">
          <div className="w-full gap-x-2 border pr-2 md:flex">
            <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
              <div className="w-full pt-[56%]">
                <div className="absolute inset-0">
                  <img
                    src="https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="JavaScript Fundamentals: Variables and Data Types"
                    className="h-full w-full"
                  />
                </div>
                <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                  20:45
                </span>
              </div>
            </div>
            <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
              <div className="h-12 w-12 shrink-0 md:hidden">
                <img
                  src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="reactpatterns"
                  className="h-full w-full rounded-full"
                />
              </div>
              <div className="w-full pt-1 md:pt-0">
                <h6 className="mb-1 text-sm font-semibold">
                  JavaScript Fundamentals: Variables and Data Types
                </h6>
                <p className="mb-0.5 mt-2 text-sm text-gray-200">Code Master</p>
                <p className="flex text-sm text-gray-200">
                  10.3k Views · 44 minutes ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoPage;
