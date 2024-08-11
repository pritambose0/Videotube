import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useParams } from "react-router-dom";
import AboutVideo from "../components/AboutVideo";
import VideoInfo from "../components/VideoInfo";
import { useSelector } from "react-redux";

function VideoPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState({});
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`/videos/${videoId}`)
      .then((video) => setVideo(video.data?.data))
      .catch((err) => console.log(err));
  }, [videoId]);

  const userId = useSelector((state) => state.auth.userData?._id);
  // console.log(userId);

  useEffect(() => {
    userId &&
      axiosInstance
        .get(`/playlists/user/${userId}`)
        .then((res) => setPlaylists(res.data?.data))
        .catch((error) => {
          console.log(error);
        });
  }, [userId]);
  // console.log(playlists);

  // console.log(video?.owner && video?.owner[0]?._id);
  // console.log(video?.videoFile?.url);
  // console.log(video && video?.owner && video?.owner[0].fullName);
  const handleClick = () => {};

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0">
      <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
        <div className="col-span-12 w-full">
          <div className="relative mb-4 w-full pt-[56%]">
            <div className="absolute inset-0">
              <video className="h-full w-full" controls>
                <source src={video?.videoFile?.url} type="video/mp4" />
              </video>
            </div>
          </div>
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

            <div onClick={handleClick}>
              <VideoInfo
                channelImage={video?.thumbnail?.url}
                channelName={video && video?.owner && video?.owner[0].fullName}
                subscribers={video?.subscribersCount || 0}
                description={video?.description}
              />
            </div>
          </div>

          <button className="peer w-full rounded-lg border p-4 text-left duration-200 hover:bg-white/5 focus:bg-white/5 sm:hidden">
            <h6 className="font-semibold">573 Comments...</h6>
          </button>
          <div className="fixed inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border bg-[#121212] p-4 duration-200 hover:top-[67px] peer-focus:top-[67px] sm:static sm:h-auto sm:max-h-[500px] lg:max-h-none">
            <div className="block">
              <h6 className="mb-4 font-semibold">573 Comments</h6>
              <input
                type="text"
                className="w-full rounded-lg border bg-transparent px-2 py-1 placeholder-white"
                placeholder="Add a Comment"
              />
            </div>
            <hr className="my-4 border-white" />
            <div>
              <div className="flex gap-x-4">
                <div className="mt-2 h-11 w-11 shrink-0">
                  <img
                    src="https://images.pexels.com/photos/18148932/pexels-photo-18148932/free-photo-of-woman-reading-book-on-a-bench.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="sarahjv"
                    className="h-full w-full rounded-full"
                  />
                </div>
                <div className="block">
                  <p className="flex items-center text-gray-200">
                    Sarah Johnson ·<span className="text-sm">17 hour ago</span>
                  </p>
                  <p className="text-sm text-gray-200">@sarahjv</p>
                  <p className="mt-3 text-sm">
                    This series is exactly what I&#x27;ve been looking for!
                    Excited to dive into these advanced React patterns. Thanks
                    for putting this together!
                  </p>
                </div>
              </div>
              <hr className="my-4 border-white" />
            </div>
          </div>
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
