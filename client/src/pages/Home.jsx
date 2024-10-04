import VideoCard from "../components/Video/VideoCard";
import axiosInstance from "../services/axiosInstance";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import VideoCardSkeleton from "../components/VideoCardSkeleton";

function Home() {
  const {
    data: videos,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await axiosInstance.get("/videos");
      return res.data?.data;
    },
    staleTime: 1000 * 60,
  });

  return (
    <section className="w-full pb-[80px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      {/* Error State */}
      {isError ? (
        <div className="flex h-screen items-center justify-center text-center p-1">
          <h3 className="text-xl font-bold text-red-500">
            {error.response?.data?.message ||
              "An error occurred while fetching videos."}
          </h3>
        </div>
      ) : isLoading ? (
        // Loading State
        <div className="min-h-screen grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>
      ) : videos?.length ? (
        // Videos Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
          {videos.map((video) => (
            <Link to={`/videos/${video._id}`} key={video._id}>
              <VideoCard
                duration={video.duration}
                author={video.owner[0]?.fullName}
                avatar={video.owner[0]?.avatar?.url}
                thumbnailSrc={video.thumbnail?.url}
                title={video.title}
                views={video.views}
                timeAgo={video.createdAt}
              />
            </Link>
          ))}
        </div>
      ) : (
        // No Videos Available
        <div className="flex items-center justify-center text-center p-1">
          <h4 className="text-lg font-semibold text-gray-400">
            No videos available at the moment. Please check back later.
          </h4>
        </div>
      )}
    </section>
  );
}

export default Home;
