import axiosInstance from "../services/axiosInstance";
import { Link, useParams } from "react-router-dom";
import AboutVideo from "../components/Video/AboutVideo";
import VideoInfo from "../components/Video/VideoInfo";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import Comments from "../components/Comment/CommentModel";
import { useEffect } from "react";
import VideoCard from "../components/Video/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";

function VideoPage() {
  const { videoId } = useParams();
  const username = useSelector((state) => state.auth.userData?.username);

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
    staleTime: 300000,
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

  const { data: recommendedVideos, isLoading: isLoadingRecommendedVideos } =
    useQuery({
      queryKey: ["recommendedVideos", videoId],
      queryFn: async () => {
        const res = await axiosInstance.get(
          `/videos/recommendation/${videoId}`
        );
        return res.data?.data;
      },
      staleTime: 1000 * 60,
    });

  // console.log("Recommended Videos", recommendedVideos);

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] lg:ml-0 sm:pb-0">
      <div className="flex flex-col lg:flex-row p-1">
        {/* Video Player Section */}
        <div className="w-full lg:w-3/4">
          <div className="relative mb-4 w-full pt-[56%]">
            <div className="absolute inset-0">
              {video ? (
                <video className="h-full w-full rounded-lg" controls>
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

          {/* Video Information */}
          {video ? (
            <div className="group mb-4 w-full rounded-lg border border-gray-700 p-4 transition duration-200">
              <AboutVideo
                title={video.title}
                views={video.views}
                timeAgo={video.createdAt}
                likes={video.likesCount || 0}
                isLiked={video.isLiked}
                playlists={playlists}
              />
              <VideoInfo
                channelUsername={video.owner?.username}
                channelImage={video.owner?.avatar?.url}
                channelName={video.owner?.fullName}
                description={video.description}
                channelId={video.owner?._id}
                subscribers={video.owner?.subscriberCount}
                subscribeStatus={video.owner?.isSubscribed}
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-y-2 animate-pulse p-1">
              <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                <div className="h-6 w-3/4 bg-gray-700 rounded"></div>
                <div className="mt-2 h-4 w-1/2 bg-gray-700 rounded"></div>
              </div>
              <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                <div className="flex items-center justify-between gap-x-4">
                  <div className="flex overflow-hidden rounded-lg border">
                    <div className="h-10 w-20 bg-gray-700 rounded-l"></div>
                    <div className="h-10 w-10 bg-gray-700"></div>
                  </div>
                  <div className="h-10 w-28 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          )}

          {/* Comments Section */}
          {video && <Comments />}
        </div>

        {/* Suggested Videos  */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 p-2">
          {isLoadingRecommendedVideos ? (
            <div>
              {Array.from({ length: 1 }).map((_, index) => (
                <VideoCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            recommendedVideos?.map((video) => (
              <Link to={`/videos/${video._id}`} key={video._id}>
                <VideoCard
                  duration={video.duration}
                  author={video.owner?.fullName}
                  avatar={video.owner?.avatar?.url}
                  thumbnailSrc={video.thumbnail?.url}
                  title={video.title}
                  views={video.views}
                  timeAgo={video.createdAt}
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default VideoPage;
