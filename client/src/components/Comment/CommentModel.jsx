import { useEffect, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import axiosInstance from "../../services/axiosInstance";
import { timeAgoFormat } from "../../utils/timeAgoFormat";
import { useParams } from "react-router-dom";
import Comment from "./Comment";

const Comments = () => {
  const { videoId } = useParams();
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", videoId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get(`/comments/${videoId}`, {
        params: { page: pageParam, limit: 5 },
      });
      return res?.data?.data;
    },
    staleTime: 1000 * 60,
    enabled: !!videoId,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.comments?.length
        ? allPages.length + 1
        : undefined;
      return nextPage;
    },
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/comments/${videoId}`, {
        content: comment,
      });
      return res?.data?.data;
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries(["comments", videoId]);
      alert("Comment added successfully");
    },
    onError: (error) => {
      console.error("Comment error:", error.response?.data.message);
    },
  });

  const handleAddComment = () => {
    if (videoId) {
      addCommentMutation.mutate();
    }
  };

  return (
    <>
      <button className="peer w-full rounded-lg border p-4 text-left duration-200 hover:bg-white/5 focus:bg-white/5 md:hidden">
        <h6 className="font-semibold">
          {comments?.pages[0].totalComments || 0} Comments
        </h6>
      </button>
      <div className="fixed inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border bg-[#121212] p-4 duration-200 hover:top-[67px] peer-focus:top-[80px] md:static md:h-auto md:max-h-[500px] lg:max-h-none">
        <div className="block">
          <h6 className="mb-4 font-semibold">
            {comments?.pages[0].totalComments || 0} Comments
          </h6>
          <div className="flex relative">
            <input
              type="text"
              className="w-full rounded-lg border bg-transparent px-3 py-2 placeholder-white"
              placeholder="Add a Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#ae7aff] px-4 py-1 text-white"
              onClick={handleAddComment}
            >
              Post
            </button>
          </div>
        </div>
        <hr className="my-4 border-white" />

        <div>
          {comments?.pages.map((page, pageIndex) => (
            <div key={pageIndex}>
              {page?.comments?.map((comment) => (
                <Comment
                  key={comment._id}
                  ownerAvatar={comment.owner?.avatar}
                  comment={comment.content}
                  timeAgo={timeAgoFormat(comment.createdAt)}
                  fullName={comment.owner?.fullName}
                  username={comment.owner?.username}
                  commentId={comment._id}
                />
              ))}
            </div>
          ))}
        </div>
        <div ref={ref} className="w-full text-center">
          {isFetchingNextPage && "Loading..."}
        </div>
        {/* <button onClick={() => fetchNextPage()}>Load More</button> */}
      </div>
    </>
  );
};

export default Comments;
