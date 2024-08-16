import { QueryClient, useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import axiosInstance from "../services/axiosInstance";
import { useParams } from "react-router-dom";

function Comment({
  ownerAvatar,
  timeAgo,
  username,
  comment,
  fullName,
  commentId,
}) {
  const { videoId } = useParams();
  const queryClient = new QueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/comments/c/${commentId}`);
      return res.data;
    },
    onSuccess: () => {
      alert("Comment deleted successfully");
      queryClient.invalidateQueries(["comments", videoId]);
    },
    onError: (error) => {
      console.error("Error deleting comment:", error.response?.data.message);
    },
  });
  const handleCommentDelete = () => {
    if (commentId) {
      mutation.mutate();
    }
  };
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
            {fullName} · <span className="text-sm ml-1">{timeAgo}</span>
          </p>
          <p className="text-sm text-gray-200">@{username}</p>
          <p className="mt-3 text-sm">{comment}</p>
        </div>
        <button
          className="ml-auto text-md text-white bg-red-500 px-3 rounded-md py-1 my-auto"
          onClick={handleCommentDelete}
        >
          Delete
        </button>
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
  commentId: PropTypes.string.isRequired,
};

export default Comment;
