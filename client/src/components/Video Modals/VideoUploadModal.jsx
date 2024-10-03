import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../services/axiosInstance";
import UploadingModal from "./UploadingModal";
import toast, { Toaster } from "react-hot-toast";
import Input from "../Input";

function VideoUploadModal({ isOpen, onClose }) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const controller = new AbortController();
  const mutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("videoFile", data.video[0]);
      formData.append("thumbnail", data.thumbnail[0]);

      for (const key in data) {
        if (key !== "video" && key !== "thumbnail") {
          formData.append(key, data[key]);
        }
      }

      const res = await axiosInstance.post(`/videos/upload-video`, formData, {
        signal: controller.signal,
      });
      return res.data;
    },
    onSuccess: () => {
      onClose(true);
      toast.success("Video Uploaded Successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error while uploading video"
      );
      console.error("Error while uploading video :", error);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    setFileName(data.video[0]?.name);
    setFileSize(data.video[0]?.size);
    mutation.mutate(data);
    setIsUploading(true);
  };

  const handleCancel = () => {
    controller.abort();
    setIsUploading(false);
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm px-4 pb-[86px] pt-4 sm:px-14 sm:py-8">
      <Toaster />
      <form
        className="h-full overflow-auto border bg-[#121212]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">Upload Videos</h2>
          <div className="flex gap-5">
            <button
              className="h-6 w-6 my-auto"
              onClick={handleClose}
              type="button"
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
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-4 p-4">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <span className="mb-4 inline-block w-24 rounded-full bg-[#E4D3FF] p-4 text-[#AE7AFF]">
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
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                ></path>
              </svg>
            </span>
            <h6 className="mb-2 font-semibold">
              Drag and drop video files to upload
            </h6>
            <p className="text-gray-400">
              Your videos will be private until you publish them.
            </p>
            <label
              htmlFor="upload-video"
              className="group/btn mt-4 inline-flex w-auto cursor-pointer items-center gap-x-2 text-center px-4 py-2 bg-[#AE7AFF] text-black rounded-md font-bold hover:bg-[#985EEB] transition"
            >
              <input
                type="file"
                id="upload-video"
                className="sr-only"
                accept="video/mp4, video/x-m4v, video/*"
                {...register("video", { required: "Video is required" })}
              />
              Select File
            </label>
            {errors.video && (
              <p className="text-red-500 text-sm mt-1">
                {errors.video.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <Input
              id="thumbnail"
              label="Thumbnail"
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/gif"
              className="file:mr-4 file:border-none file:bg-[#ae7aff] file:text-black file:px-4 file:py-2 file:rounded-md file:hover:bg-[#965dff] cursor-pointer"
              {...register("thumbnail", { required: "Thumbnail is required" })}
            />
            {errors.thumbnail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.thumbnail.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <Input
              id="title"
              label="Title"
              type="text"
              className="w-full border bg-transparent px-2 py-1 outline-none"
              {...register("title", { required: "Title is required" })} //
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="desc" className="mb-1 inline-block">
              Description
              <sup className="text-red-500">*</sup>
            </label>
            <textarea
              id="desc"
              className="w-full h-32 p-2 mt-2 rounded-lg border border-gray-600 bg-transparent text-white resize-none focus:border-[#ae7aff] focus:ring-2 focus:ring-[#ae7aff] outline-none"
              {...register("description")}
            ></textarea>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#AE7AFF] text-black rounded-md font-bold hover:bg-[#985EEB] transition"
            >
              Upload
            </button>
          </div>
        </div>
        {isUploading && (
          <UploadingModal
            onCancel={handleCancel}
            isUploading={isUploading}
            fileName={fileName}
            fileSize={fileSize}
          />
        )}
      </form>
    </div>
  );
}

VideoUploadModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default VideoUploadModal;
