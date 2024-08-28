import PropTypes from "prop-types";
import { timeAgoFormat } from "../../utils/timeAgoFormat";

const VideoCard = ({
  avatar,
  duration,
  thumbnailSrc,
  title,
  views,
  timeAgo,
  author,
}) => {
  function convertToTime(decimalNumber) {
    // Extract the minutes
    const minutes = Math.floor(decimalNumber);
    // Convert the fractional part to seconds
    const fractionalPart = decimalNumber - minutes;
    const seconds = Math.floor(fractionalPart * 60);
    // Ensure seconds are displayed as two digits
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    return `${minutes}:${formattedSeconds}`;
  }

  return (
    <div className="w-full">
      <div className="relative mb-2 w-full pt-[56%]">
        <div className="absolute inset-0">
          <img src={thumbnailSrc} alt={title} className="h-full w-full" />
        </div>
        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
          {convertToTime(duration)}
        </span>
      </div>
      <div className="flex gap-x-2">
        <div className="h-10 w-10 shrink-0">
          <img
            src={avatar}
            alt={author}
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="w-full">
          <h6 className="mb-1 font-semibold">{title}</h6>
          <p className="flex text-sm text-gray-200">
            {views} Views · {timeAgoFormat(timeAgo)}
          </p>
          <p className="text-sm text-gray-200">{author}</p>
        </div>
      </div>
    </div>
  );
};

VideoCard.propTypes = {
  avatar: PropTypes.string,
  duration: PropTypes.number,
  thumbnailSrc: PropTypes.string,
  title: PropTypes.string,
  views: PropTypes.number,
  timeAgo: PropTypes.string,
  author: PropTypes.string,
};

export default VideoCard;