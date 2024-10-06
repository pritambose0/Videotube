import PropTypes from "prop-types";
import { timeAgoFormat } from "../../utils/timeAgoFormat";
import { convertToTime } from "../../utils/convertToTime.js";

const VideoCard = ({
  avatar,
  duration,
  thumbnailSrc,
  title,
  views,
  timeAgo,
  author,
}) => {
  return (
    <div className="w-full">
      <div className="relative mb-2 w-full pt-[56%]">
        <div className="absolute inset-0">
          <img
            src={thumbnailSrc}
            alt={title}
            className="h-full w-full rounded-md"
          />
        </div>
        <span className="absolute bottom-1 right-1 inline-block rounded-sm bg-black bg-opacity-60 px-1.5 text-xs">
          {convertToTime(duration)}
        </span>
      </div>
      <div className="flex gap-x-2 mx-2">
        <div className="h-10 w-10 shrink-0">
          <img
            src={avatar}
            alt={author}
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="w-full">
          <h6 className="text-[0.92rem] font-semibold text-gray-200">
            {title}
          </h6>
          <p className="flex text-xs text-gray-300">
            {author} · {views} Views · {timeAgoFormat(timeAgo)}
          </p>
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
