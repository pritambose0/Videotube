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
      {isError && (
        <div className="flex h-full items-center justify-center text-center">
          <h3 className="text-xl font-bold text-red-500">
            {error.response?.data?.message ||
              "An error occurred while fetching videos."}
          </h3>
        </div>
      )}
      {isLoading ? (
        <div className="h-screen grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 md:p-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 md:p-1">
          {videos?.length ? (
            videos.map((video) => (
              <Link
                to={`videos/${video._id}`}
                key={video._id}
                className="block hover:shadow-lg transition"
              >
                <VideoCard
                  duration={Math.round(video.duration)}
                  author={video.owner[0]?.fullName}
                  avatar={video.owner[0]?.avatar?.url}
                  thumbnailSrc={video.thumbnail?.url}
                  title={video.title}
                  views={video.views}
                  timeAgo={video.createdAt}
                />
              </Link>
            ))
          ) : (
            <div className="flex items-center justify-center text-center p-4">
              <h4 className="text-lg font-semibold text-gray-300">
                No videos available at the moment. Please check back later.
              </h4>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Home;
