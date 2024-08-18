import { useEffect, useRef, useState } from "react";
import { QueryClient, useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import axiosInstance from "../../services/axiosInstance";
import { useParams } from "react-router-dom";

function Comment({
  ownerAvatar,
  timeAgo,
  username,
  comment: initialComment,
  fullName,
  commentId,
}) {
  const { videoId } = useParams();
  const queryClient = new QueryClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(initialComment);
  const inputRef = useRef(null);

  const { mutate: deleteComment } = useMutation({
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
    onSettled: () => {
      setDropdownOpen(false);
    },
  });

  const { mutate: updateComment } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch(`/comments/c/${commentId}`, {
        content: editedComment,
      });
      return res.data;
    },
    onSuccess: () => {
      alert("Comment updated successfully");
      queryClient.invalidateQueries(["comments", videoId]);
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Error updating comment:", error.response?.data.message);
    },
  });

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setDropdownOpen(false);
  };

  const handleUpdate = () => {
    if (commentId) {
      updateComment();
    }
  };
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

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
        <div className="block flex-grow">
          <p className="flex items-center text-gray-200">
            {fullName} · <span className="text-sm ml-1">{timeAgo}</span>
          </p>
          <p className="text-sm text-gray-200">@{username}</p>

          {isEditing ? (
            <input
              className="mt-3 text-sm text-black p-2 rounded-md w-full"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              ref={inputRef}
            />
          ) : (
            <p className="mt-3 text-sm">{initialComment}</p>
          )}
        </div>

        <div className="relative ml-auto my-auto mr-3">
          {isEditing ? (
            <button
              className="text-md text-white bg-blue-500 px-3 rounded-md py-1"
              onClick={handleUpdate}
            >
              Update
            </button>
          ) : (
            <button
              className="text-2xl font-bold text-white focus:outline-none"
              onClick={toggleDropdown}
            >
              &#8942;
            </button>
          )}

          {!isEditing && dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-gray-800 text-white rounded-md shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                onClick={commentId && deleteComment}
              >
                Delete
              </button>
            </div>
          )}
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
  commentId: PropTypes.string.isRequired,
};

export default Comment;
