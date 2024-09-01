import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import PlaylistListPage from "../components/PlaylistListPage";
import VideoCardSkeleton from "../components/VideoCardSkeleton";

function Playlists() {
  const { username } = useParams();

  const { data: playlists, isLoading } = useQuery({
    queryKey: ["playlists", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/playlists/user/${username}`);
      return res?.data?.data || [];
    },
    staleTime: Infinity,
    enabled: !!username,
  });

  console.log("PLAYLISTS", playlists);
  // const thumbnail = playlists && playlists[0]?.thumbnail?.url;

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 pt-2 sm:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]">
          {playlists?.map((playlist) => (
            <PlaylistListPage
              key={playlist._id}
              thumbnail={playlist.videos && playlist.videos[0]?.thumbnail?.url}
              description={playlist.description}
              playlistId={playlist._id}
              playlistName={playlist.name}
              totalVideos={playlist.videos.length}
            />
          ))}
        </div>
      )}

      {!playlists ||
        (playlists.length === 0 && (
          <section className="w-full pb-[70px] sm:pb-0 lg:ml-0">
            <div className="px-4 pb-4">
              <div className="flex justify-center p-4">
                <div className="w-full max-w-sm text-center">
                  <p className="mb-3 w-full">
                    <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                      <span className="inline-block w-6">
                        <svg
                          width="100%"
                          viewBox="0 0 22 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 5L10.8845 2.76892C10.5634 2.1268 10.4029 1.80573 10.1634 1.57116C9.95158 1.36373 9.69632 1.20597 9.41607 1.10931C9.09916 1 8.74021 1 8.02229 1H4.2C3.0799 1 2.51984 1 2.09202 1.21799C1.71569 1.40973 1.40973 1.71569 1.21799 2.09202C1 2.51984 1 3.0799 1 4.2V5M1 5H16.2C17.8802 5 18.7202 5 19.362 5.32698C19.9265 5.6146 20.3854 6.07354 20.673 6.63803C21 7.27976 21 8.11984 21 9.8V14.2C21 15.8802 21 16.7202 20.673 17.362C20.3854 17.9265 19.9265 18.3854 19.362 18.673C18.7202 19 17.8802 19 16.2 19H5.8C4.11984 19 3.27976 19 2.63803 18.673C2.07354 18.3854 1.6146 17.9265 1.32698 17.362C1 16.7202 1 15.8802 1 14.2V5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                      </span>
                    </span>
                  </p>
                  <h5 className="mb-2 font-semibold">No playlist created</h5>
                  <p>There are no playlist created on this channel.</p>
                </div>
              </div>
            </div>
          </section>
        ))}
    </>
  );
}

export default Playlists;
