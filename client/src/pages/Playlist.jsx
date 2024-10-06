import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { timeAgoFormat } from "../utils/timeAgoFormat";
import PlaylistSkeleton from "../components/PlaylistSkeleton";

function Playlist() {
  const { playlistId } = useParams();
  const { data: playlist, isLoading } = useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/playlists/${playlistId}`);
      return response.data?.data;
    },
    staleTime: 1000 * 60,
    enabled: !!playlistId,
  });
  console.log("Videos", playlist);

  if (isLoading) {
    return <PlaylistSkeleton />;
  }

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
        {/* Playlist Card */}
        <div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
          <div className="relative mb-2 w-full pt-[56%]">
            <div className="absolute inset-0">
              <img
                src={playlist?.videos?.[0].thumbnail?.url}
                alt={playlist?.owner?.fullName}
                className="h-full w-full object-cover rounded-md"
              />
              <div className="absolute inset-x-0 bottom-0">
                <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                  <div className="relative z-[1]">
                    <p className="flex justify-between">
                      <span>Playlist</span>
                      <span>{playlist?.videos?.length || 0} videos</span>
                    </p>
                    <p className="text-sm text-gray-200">
                      {timeAgoFormat(playlist?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h6 className="mb-1 font-semibold">{playlist?.owner?.fullName}</h6>
          <p className="text-sm text-gray-200">{playlist?.description}</p>
          <div className="mt-6 flex items-center gap-x-3">
            <div className="h-16 w-16 shrink-0">
              <img
                src={playlist?.owner?.avatar.url}
                alt={playlist?.owner?.fullName}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="w-full">
              <h6 className="font-semibold">{playlist?.owner?.fullName}</h6>
              <p className="text-sm text-gray-300">
                {playlist?.owner?.subscriberCount} Subscribers
              </p>
            </div>
          </div>
        </div>

        {/* Video List */}
        <div className="flex w-full flex-col gap-y-4">
          {playlist?.videos?.length > 0 &&
            playlist.videos.map((video) => (
              <Link
                to={`/videos/${video._id}`}
                key={video._id}
                className="flex gap-x-4"
              >
                {/* Updated Thumbnail with smaller size */}
                <div className="w-56 h-32">
                  <img
                    src={video.thumbnail?.url}
                    alt={video.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Rest of the video data stays the same */}
                <div className="flex-1">
                  <h6 className="font-semibold text-white mb-2">
                    {video.title}
                  </h6>
                  <p className="text-sm text-gray-400">
                    {video.owner?.fullName}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {video.views} views · {timeAgoFormat(video.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}

export default Playlist;
