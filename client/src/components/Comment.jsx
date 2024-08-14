import PropTypes from "prop-types";

function Comment({ ownerAvatar, timeAgo, username, comment, fullName }) {
  return (
    <div>
      <div className="flex gap-x-4">
        <div className="mt-2 h-11 w-11 shrink-0">
          <img
            src={ownerAvatar}
            alt={username}
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="block">
          <p className="flex items-center text-gray-200">
            {fullName} · <span className="text-sm">{timeAgo}</span>
          </p>
          <p className="text-sm text-gray-200">@{username}</p>
          <p className="mt-3 text-sm">{comment}</p>
        </div>
      </div>
      <hr className="my-4 border-white" />
    </div>
  );
}

Comment.propTypes = {
  ownerAvatar: PropTypes.string.isRequired,
  timeAgo: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
};

export default Comment;
