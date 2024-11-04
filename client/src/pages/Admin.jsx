import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axiosInstance from "../services/axiosInstance";
import { timeAgoFormat } from "../utils/timeAgoFormat";
import { useState } from "react";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

function Admin() {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoId, setVideoId] = useState("");
  const userData = useSelector((state) => state.auth.userData);
  const username = userData?.username;
  const { register, handleSubmit, reset } = useForm();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardData", username],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/users/c/${username}/dashboard`
      );
      return response.data?.data;
    },
    enabled: !!username,
  });

  const handleDelete = (videoId) => {
    setVideoId(videoId);
    setDeleteModalOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(`/videos/delete/${videoId}`);
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("Video deleted successfully");
      setDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error deleting video");
      console.error("Error deleting video:", error.response?.data.message);
    },
  });

  const handleEdit = (videoId) => {
    setVideoId(videoId);
    setIsEditing(true);
  };

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.patch(`/videos/update/${videoId}`, {
        ...data,
        thumbnail: data.thumbnail?.[0] || null,
      });
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("Video updated successfully");
      setIsEditing(false);
      reset();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error updating video");
      console.error("Error updating video:", error);
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse mx-auto flex w-full sm:ml-[70px] sm:pb-0 lg:ml-0 flex-col gap-y-6 py-8 px-2 pb-[80px]">
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
          {Array(3)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="rounded-md bg-[#1e1e1e] p-4 space-y-4"
              >
                <div className="h-7 w-7 rounded-full bg-gray-700"></div>
                <div className="h-6 bg-gray-700 rounded-md"></div>
                <div className="h-8 bg-gray-700 rounded-md"></div>
              </div>
            ))}
        </div>

        <div className="overflow-hidden mt-6">
          {Array(3)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 p-4 mb-4 bg-[#1e1e1e] rounded-lg shadow animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="h-6 w-16 bg-gray-700 rounded-md"></div>
                  <div className="h-6 w-40 bg-gray-700 rounded-md"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-6 w-24 bg-gray-700 rounded-md"></div>
                  <div className="h-6 w-32 bg-gray-700 rounded-md"></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        An error occurred while fetching history.
      </div>
    );
  }
  return (
    <div className="mx-auto flex w-full sm:ml-[70px] sm:pb-0 lg:ml-0 flex-col gap-y-6 py-8 px-2 pb-[80px]">
      <div className="flex flex-wrap justify-between gap-4 px-1">
        <div className="block">
          <h1 className="text-2xl font-bold">
            Welcome Back, {userData?.fullName}
          </h1>
          <p className="text-sm text-gray-300">
            Seamless Video Management, Elevated Results.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 ">
        <div className="rounded-md bg-[#1e1e1e] p-4">
          <div className="mb-4 block">
            <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </span>
          </div>
          <h6 className="text-gray-300">Total views</h6>
          <p className="text-3xl font-semibold">{data?.totalViews}</p>
        </div>
        <div className="rounded-md bg-[#1e1e1e] p-4">
          <div className="mb-4 block">
            <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                ></path>
              </svg>
            </span>
          </div>
          <h6 className="text-gray-300">Total subscribers</h6>
          <p className="text-3xl font-semibold">{data?.totalSubscribers}</p>
        </div>
        <div className="rounded-md bg-[#1e1e1e] p-4">
          <div className="mb-4 block">
            <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                ></path>
              </svg>
            </span>
          </div>
          <h6 className="text-gray-300">Total likes</h6>
          <p className="text-3xl font-semibold">{data?.totalLikes}</p>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full border-collapse text-white">
          <thead className="hidden md:table-header-group">
            <tr>
              <th className="border-b p-4 text-left">Status</th>
              <th className="border-b p-4 text-left">Title</th>
              <th className="border-b p-4 text-left">Views</th>
              <th className="border-b p-4 text-left">Date Uploaded</th>
              <th className="border-b p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {data?.totalVideos?.map((video) => (
              <tr
                key={video._id}
                className="flex flex-col gap-2 p-4 mb-4 bg-[#1e1e1e] rounded-lg shadow md:table-row md:p-0 md:shadow-none"
              >
                <td className="flex items-center justify-between md:table-cell border-b border-gray-600 py-2 md:py-3">
                  <span className="font-semibold md:hidden">Status:</span>
                  <span className="rounded-2xl px-2 py-0.5 text-green-600">
                    Published
                  </span>
                </td>
                <td className="flex items-start justify-between md:items-center md:table-cell border-b border-gray-600 py-2 md:py-3">
                  <span className="font-semibold md:hidden">Title:</span>
                  <h3 className="text-base font-semibold">{video.title}</h3>
                </td>
                <td className="flex items-center justify-between md:table-cell border-b border-gray-600 py-2 md:py-3">
                  <span className="font-semibold md:hidden">Views :</span>
                  <div className="flex gap-1">
                    <span>{video.views} views</span>
                  </div>
                </td>
                <td className="flex items-center justify-between md:table-cell border-b border-gray-600 py-2 md:py-3">
                  <span className="font-semibold md:hidden">
                    Date Uploaded:
                  </span>
                  <span>{timeAgoFormat(video.createdAt)}</span>
                </td>
                <td className="flex items-center justify-between md:table-cell border-b border-gray-600 py-2 md:py-3">
                  <span className="font-semibold md:hidden">Actions:</span>
                  <div className="flex gap-2">
                    <button
                      className="h-6 w-6 hover:text-[#ae7aff]"
                      onClick={() => handleEdit(video._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        ></path>
                      </svg>
                    </button>

                    <button
                      className="h-6 w-6 hover:text-[#ae7aff]"
                      onClick={() => handleDelete(video._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Edit Video</h2>

            <form
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
              method="PATCH"
            >
              <div className="w-full">
                <Input
                  id="title"
                  label="Title"
                  type="text"
                  placeholder="Enter video title"
                  {...register("title")}
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="desc"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Description <sup className="text-red-500">*</sup>
                </label>
                <textarea
                  id="desc"
                  className="h-40 w-full border border-gray-600 bg-transparent px-4 py-2 rounded-md text-white placeholder-gray-400 resize-none outline-none focus:border-[#ae7aff] focus:ring-2 focus:ring-[#ae7aff]"
                  placeholder="Enter video description"
                  {...register("description")}
                ></textarea>
              </div>

              <div className="w-full">
                <Input
                  id="thumbnail"
                  label="Thumbnail"
                  type="file"
                  {...register("thumbnail")}
                  accept="image/png, image/jpg, image/jpeg, image/gif"
                  className="file:mr-4 file:border-none file:bg-[#ae7aff] file:text-black file:px-4 file:py-2 file:rounded-md file:hover:bg-[#965dff] cursor-pointer"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ae7aff] text-black rounded-md hover:bg-[#965dff] transition-colors disabled:opacity-50"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Updating..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-black rounded-md hover:bg-red-700 transition-colors"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this video?</p>
            <div className="flex gap-2 mt-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
