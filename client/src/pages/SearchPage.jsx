import { useQuery } from "@tanstack/react-query";
import VideoCard from "../components/Video/VideoCard";
import axiosInstance from "../services/axiosInstance";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import VideoCardSkeleton from "../components/VideoCardSkeleton";

function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("search");

  const {
    data: videos,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["searchedVideos", query],
    queryFn: async () => {
      const res = await axiosInstance.get("/videos", {
        params: {
          query,
        },
      });
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
        <div className="flex flex-col items-center justify-center text-center p-6  rounded-lg shadow-md h-screen">
          <h4 className="text-2xl font-semibold mb-2">
            No videos found for "{query}"
          </h4>
          <p className="text-md text-gray-500">
            Try searching with different keywords or check back later.
          </p>
        </div>
      )}
    </section>
  );
}

export default SearchPage;
