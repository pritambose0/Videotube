import PropTypes from "prop-types";

function SubscribedChannelsList({ channelAvatar, channelName, subscribers }) {
  return (
    <div className="flex w-full justify-between">
      <div className="flex items-center gap-x-2">
        <div className="h-14 w-14 shrink-0">
          <img
            src={channelAvatar}
            alt={channelName}
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="block">
          <h6 className="font-semibold">{channelName}</h6>
          <p className="text-sm text-gray-300">{subscribers} Subscribers</p>
        </div>
      </div>
    </div>
  );
}

SubscribedChannelsList.propTypes = {
  channelAvatar: PropTypes.string,
  channelName: PropTypes.string,
  subscribers: PropTypes.number,
};

export default SubscribedChannelsList;
