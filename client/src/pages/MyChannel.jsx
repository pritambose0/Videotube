import { useState } from "react";
import VideoUploadModal from "../components/Video Modals/VideoUploadModal";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { useParams } from "react-router-dom";
import VideoListPage from "../components/VideoListPage";
import VideoCardSkeleton from "../components/VideoCardSkeleton";

function MyChannel() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { username } = useParams();

  const { data: videos, isLoading } = useQuery({
    queryKey: ["channelVideos"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/c/${username}/videos`);
      return res?.data?.data;
    },
    staleTime: Infinity,
    enabled: !!username,
  });

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
          {videos?.map((video) => (
            <VideoListPage
              key={video._id}
              views={video.views}
              title={video.title}
              thumbnail={video.thumbnail?.url}
              timeAgo={video.createdAt}
              duration={video.duration}
              id={video._id}
            />
          ))}
        </div>
      )}

      {!videos ||
        (videos.length === 0 && (
          <div className="flex justify-center p-4">
            <div className="w-full max-w-sm text-center">
              <p className="mb-3 w-full">
                <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
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
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                    ></path>
                  </svg>
                </span>
              </p>
              <h5 className="mb-2 font-semibold">No videos uploaded</h5>
              <p>
                This page has yet to upload a video. Search another page in
                order to find more videos.
              </p>
              <button
                className="mt-4 inline-flex items-center gap-x-2 bg-[#ae7aff] px-3 py-2 font-semibold text-black"
                onClick={openModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  ></path>
                </svg>{" "}
                New video
              </button>
              <VideoUploadModal isOpen={isModalOpen} onClose={closeModal} />
            </div>
          </div>
        ))}
    </>
  );
}

export default MyChannel;
