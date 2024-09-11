import axiosInstance from "../services/axiosInstance";
import { useParams } from "react-router-dom";
import AboutVideo from "../components/Video/AboutVideo";
import VideoInfo from "../components/Video/VideoInfo";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import Comments from "../components/Comment/CommentModel";
import { useEffect } from "react";

function VideoPage() {
  const { videoId } = useParams();
  const username = useSelector((state) => state.auth.userData?.username);
  // console.log("USERNAME", username);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch video data
  const { data: video } = useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/videos/${videoId}`);
      return res?.data?.data;
    },
    staleTime: Infinity,
    enabled: !!videoId,
  });

  // Fetch playlists data
  const { data: playlists } = useQuery({
    queryKey: ["playlists", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/playlists/user/${username}`);
      return res?.data?.data || [];
    },
    staleTime: Infinity,
    enabled: !!username,
  });
  // console.log(video);

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] lg:ml-0 sm:pb-0">
      <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
        <div className="col-span-12 w-full">
          <div className="relative mb-4 w-full pt-[56%]">
            <div className="absolute inset-0">
              {video ? (
                <video className="h-full w-full" controls>
                  <source src={video?.videoFile?.url} type="video/mp4" />
                </video>
              ) : (
                <div className="w-full animate-pulse">
                  <div className="relative mb-2 w-full pt-[56%] bg-gray-700">
                    <div className="absolute inset-0 bg-gray-600"></div>
                    <span className="absolute bottom-1 right-1 inline-block rounded bg-gray-500 px-1.5 text-sm h-4 w-10"></span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {video ? (
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

              <VideoInfo
                channelUsername={video?.owner?.username}
                channelImage={video?.owner?.avatar?.url}
                channelName={video?.owner?.fullName}
                description={video?.description}
                channelId={video?.owner?._id}
                subscribers={video?.owner?.subscriberCount}
                subscribeStatus={video?.owner?.isSubscribed}
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-y-2 animate-pulse">
              <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                <div className="h-6 w-3/4 bg-gray-700 rounded"></div>
                <div className="mt-2 h-4 w-1/2 bg-gray-700 rounded"></div>
              </div>
              <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                <div className="flex items-center justify-between gap-x-4 md:justify-end lg:justify-between xl:justify-end">
                  <div className="flex overflow-hidden rounded-lg border">
                    <div className="h-10 w-20 bg-gray-700 rounded-l"></div>
                    <div className="h-10 w-10 bg-gray-700"></div>
                  </div>
                  <div className="h-10 w-28 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          )}

          {video ? <Comments /> : ""}
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
