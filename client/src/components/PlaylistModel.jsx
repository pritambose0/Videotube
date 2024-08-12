import PropTypes from "prop-types";
import { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useParams } from "react-router-dom";

const PlaylistModal = ({ playlists }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCheckboxChange = (id) => {
    setSelectedItem((prevSelectedItem) =>
      prevSelectedItem && prevSelectedItem === id ? null : id
    );
    // console.log(selectedItem);
  };
  const { videoId } = useParams();
  const handlePlaylistSave = (playlistId) => {
    axiosInstance
      .patch(`/playlists/add/${videoId}/${playlistId}`)
      .then(() => alert("Added to playlist"))
      .catch((error) => console.log(error));
  };
  const [newPlaylistName, setNewPlaylistName] = useState();

  const onCreatePlaylist = () => {
    axiosInstance
      .post("/playlists/", { name: newPlaylistName })
      .then(() => alert("Playlist created successfully"))
      .catch((error) => console.log(error));
  };

  return (
    <div className="absolute right-0 top-full z-10 hidden w-64 overflow-hidden rounded-lg bg-[#121212] p-4 shadow shadow-slate-50/30 hover:block peer-focus:block">
      <h3 className="mb-4 text-center text-lg font-semibold">
        Save to playlist
      </h3>
      <ul className="mb-4">
        {playlists?.map((playlist, index) => (
          <li className="mb-2 last:mb-0" key={index}>
            <label className="group/label inline-flex cursor-pointer items-center gap-x-3">
              <input
                type="checkbox"
                className="peer hidden"
                onChange={() => handleCheckboxChange(playlist._id)}
                checked={selectedItem === playlist._id}
              />
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] border border-transparent bg-white text-white group-hover/label:border-[#ae7aff] peer-checked:border-[#ae7aff] peer-checked:text-[#ae7aff]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  ></path>
                </svg>
              </span>
              {playlist.name}
            </label>
          </li>
        ))}
        <button
          onClick={() => handlePlaylistSave(selectedItem)}
          className="peer flex items-center gap-x-2 rounded-lg bg-white px-4 py-1.5 text-black"
        >
          Save
        </button>
      </ul>
      <div className="flex flex-col">
        <label
          htmlFor="playlist-name"
          className="mb-1 inline-block cursor-pointer"
        >
          Name
        </label>
        <input
          className="w-full rounded-lg border border-transparent bg-white px-3 py-2 text-black outline-none focus:border-[#ae7aff]"
          id="playlist-name"
          placeholder="Enter playlist name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
        />
        <button
          className="mx-auto mt-4 rounded-lg bg-[#ae7aff] px-4 py-2 text-black"
          onClick={onCreatePlaylist}
        >
          Create new playlist
        </button>
      </div>
    </div>
  );
};

PlaylistModal.propTypes = {
  playlists: PropTypes.array,
};

export default PlaylistModal;