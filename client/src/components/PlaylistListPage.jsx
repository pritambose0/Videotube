import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function PlaylistListPage({
  thumbnail,
  playlistName,
  totalVideos,
  description,
  playlistId,
  username,
}) {
  return (
    <Link to={`/c/${username}/playlists/${playlistId}`}>
      <div className="w-full">
        <div className="relative mb-2 w-full pt-[56%]">
          <div className="absolute inset-0">
            <img
              src={thumbnail}
              alt={playlistName}
              className="h-full w-full rounded-md"
            />
            <div className="absolute inset-x-0 bottom-0">
              <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                <div className="relative z-[1]">
                  <p className="flex justify-between">
                    <span className="inline-block">Playlist</span>
                    <span className="inline-block">{totalVideos} videos</span>
                  </p>
                  {/* <p className="text-sm text-gray-200">
                    100K Views · 2 hours ago
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <h6 className="mb-1 font-semibold">{playlistName}</h6>
        <p className="flex text-sm text-gray-200">{description}</p>
      </div>
    </Link>
  );
}
PlaylistListPage.propTypes = {
  thumbnail: PropTypes.string,
  playlistName: PropTypes.string,
  totalVideos: PropTypes.number,
  description: PropTypes.string,
  playlistId: PropTypes.string,
  username: PropTypes.string,
};
export default PlaylistListPage;
