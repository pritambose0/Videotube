import PropTypes from "prop-types";
import { timeAgoFormat } from "../utils/timeAgoFormat";
import { convertToTime } from "../utils/convertToTime";
import { Link } from "react-router-dom";

function VideoListPage({ thumbnail, title, views, timeAgo, id, duration }) {
  return (
    <Link to={`/videos/${id}`}>
      <div className="w-full">
        <div className="relative mb-2 w-full pt-[56%]">
          <div className="absolute inset-0">
            <img src={thumbnail} alt={title} className="h-full w-full" />
          </div>
          <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
            {convertToTime(duration)}
          </span>
        </div>
        <div className="px-4">
          <h6 className="mb-1 font-semibold">{title}</h6>
          <p className="flex text-sm text-gray-200">
            {views} Views · {timeAgoFormat(timeAgo)}
          </p>
        </div>
      </div>
    </Link>
  );
}
VideoListPage.propTypes = {
  thumbnail: PropTypes.string,
  title: PropTypes.string,
  views: PropTypes.number,
  timeAgo: PropTypes.string,
  id: PropTypes.string,
  duration: PropTypes.number,
};

export default VideoListPage;
