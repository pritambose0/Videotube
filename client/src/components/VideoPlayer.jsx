import PropTypes from "prop-types";

import { useRef, useState } from "react";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolume = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  const handleProgress = (e) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percent = (offsetX / rect.width) * 100;
    setProgress(percent);
    videoRef.current.currentTime = (percent / 100) * videoRef.current.duration;
  };

  const handleTimeUpdate = () => {
    const percent =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(percent);
  };

  return (
    <div className="relative max-w-full mx-auto bg-black">
      <video
        ref={videoRef}
        src={src}
        className="w-full"
        onTimeUpdate={handleTimeUpdate}
      />
      <div className="absolute bottom-0 left-0 right-0 flex items-center p-2 bg-gray-800 bg-opacity-50">
        <button
          className="bg-gray-700 text-white p-2 rounded"
          onClick={handlePlayPause}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <div
          className="flex-1 mx-2 bg-gray-600 h-1 cursor-pointer relative"
          onClick={handleProgress}
        >
          <div
            className="bg-red-600 h-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <button
          className="bg-gray-700 text-white p-2 rounded"
          onClick={handleVolume}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>
    </div>
  );
};

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
};

export default VideoPlayer;
