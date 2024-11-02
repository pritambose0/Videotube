import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axiosInstance from "../services/axiosInstance";
// import { timeAgoFormat } from "../utils/timeAgoFormat";
import VideoCard from "../components/Video/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import { Link } from "react-router-dom";

function History() {
  const userData = useSelector((state) => state.auth.userData);
  const username = userData?.username;

  const {
    data: videos,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["historyData", username],
    queryFn: async () => {
      const response = await axiosInstance.get(`/users/history`);
      return response.data?.data;
    },
    enabled: !!username,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse mx-auto flex w-full sm:ml-[70px] sm:pb-0 lg:ml-0 flex-col gap-y-6 py-8 px-2 pb-[80px]">
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
          {Array(3)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="rounded-md bg-[#1e1e1e] p-4 space-y-4"
              >
                <div className="h-7 w-7 rounded-full bg-gray-700"></div>
                <div className="h-6 bg-gray-700 rounded-md"></div>
                <div className="h-8 bg-gray-700 rounded-md"></div>
              </div>
            ))}
        </div>
      </div>
    );
  }
  // console.log(videos);

  return (
    <section className="w-full pb-[80px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      {isError && (
        <div className="flex h-full items-center justify-center text-center p-1">
          <h3 className="text-xl font-bold text-red-500">
            {error.response?.data?.message ||
              "An error occurred while fetching videos."}
          </h3>
        </div>
      )}

      {isLoading ? (
        <div className="min-h-screen grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6 p-1">
          {videos?.length ? (
            videos.reverse().map((video) => (
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
          ) : (
            <div className="flex items-center justify-center text-center p-4">
              <h4 className="text-lg font-semibold text-gray-400">
                No videos found.
              </h4>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default History;
