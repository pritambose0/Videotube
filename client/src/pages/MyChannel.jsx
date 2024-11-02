import { useEffect, useState } from "react";
import VideoUploadModal from "../components/Video Modals/VideoUploadModal";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { Link, useParams } from "react-router-dom";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import { useSelector } from "react-redux";
import VideoCard from "../components/Video/VideoCard";

function MyChannel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { username } = useParams();
  const ownerUsername = useSelector((state) => state.auth.userData?.username);
  const owner = username === ownerUsername;

  const { data: videos, isLoading } = useQuery({
    queryKey: ["channelVideos", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/c/${username}/videos`);
      return res?.data?.data;
    },
    staleTime: Infinity,
    enabled: !!username,
  });
  console.log("Videos", videos);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {owner && (
        <div className="flex items-center justify-end p-3 w-full max-w-screen-lg mx-auto">
          <button
            className="bg-[#ae7aff] px-4 py-2 font-bold text-black transition-transform duration-150 ease-in-out rounded-sm flex gap-2 items-center active:translate-x-[2px] active:translate-y-[2px] hover:bg-[#9c6de2]"
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
            </svg>
            New video
          </button>
        </div>
      )}
      <VideoUploadModal isOpen={isModalOpen} onClose={closeModal} />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 py-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1 md:ml-1">
          {videos?.length > 0 ? (
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
            <div className="flex justify-center items-center p-6">
              <div className="w-full max-w-sm text-center ">
                <p className="mb-3">
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
                <h5 className="mb-2 font-semibold text-white">
                  No videos uploaded
                </h5>
                <p className="text-gray-300">
                  This page has yet to upload a video. Search another page in
                  order to find more videos.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default MyChannel;
