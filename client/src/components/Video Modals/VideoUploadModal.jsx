import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../services/axiosInstance";
import UploadingModal from "./UploadingModal";

function VideoUploadModal({ isOpen, onClose }) {
  const [isUploading, setIsUploading] = useState(false);
  // const [fileName, setFileName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
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
      console.log("UPLOADED");
    },
    onError: (error) => {
      console.error("Error while uploading video :", error);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    mutation.mutate(data);
    setIsUploading(true);
  };

  const handleCancel = () => {
    setIsUploading(false);
    controller.abort();
  };
  return (
    <div className="absolute inset-0 z-50 bg-black/50 px-4 pb-[86px] pt-4 sm:px-14 sm:py-8">
      <form
        className="h-full overflow-auto border bg-[#121212]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">Upload Videos</h2>
          <div className="flex gap-5">
            <button className="h-6 w-6 my-auto" onClick={onClose} type="button">
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
          <div className="w-full border-2 border-dashed px-4 py-12 text-center">
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
              className="group/btn mt-4 inline-flex w-auto cursor-pointer items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
            >
              <input
                type="file"
                id="upload-video"
                className="sr-only"
                accept="video/mp4, video/x-m4v, video/*"
                {...register("video", { required: "Video is required" })}
              />
              Select Files
            </label>
            {errors.video && (
              <p className="text-red-500 text-sm mt-1">
                {errors.video.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="thumbnail" className="mb-1 inline-block">
              Thumbnail
              <sup>*</sup>
            </label>
            <input
              id="thumbnail"
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/gif"
              className="w-full border p-1 file:mr-4 file:border-none file:bg-[#ae7aff] file:px-3 file:py-1.5"
              {...register("thumbnail", { required: "Thumbnail is required" })}
            />
            {errors.thumbnail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.thumbnail.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="title" className="mb-1 inline-block">
              Title
              <sup>*</sup>
            </label>
            <input
              id="title"
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
              <sup>*</sup>
            </label>
            <textarea
              id="desc"
              className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"
              {...register("description", {
                required: "Description is required",
              })}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="w-full mx-auto">
            <button
              type="submit"
              className=" bg-[#ae7aff] px-3 py-2 text-center font-bold text-black transition-all duration-150 ease-in-out w-24"
            >
              Upload
            </button>
            {mutation.isError && (
              <div className="text-red-500">
                An error occurred: {mutation.error.response.data.message}
              </div>
            )}
          </div>
        </div>
        {isUploading && <UploadingModal onCancel={handleCancel} />}
      </form>
    </div>
  );
}

VideoUploadModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default VideoUploadModal;
