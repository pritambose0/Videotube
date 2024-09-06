import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import Input from "../components/Input";
import axiosInstance from "../services/axiosInstance";
import toast, { Toaster } from "react-hot-toast";

function EditPersonalInfo() {
  const user = useSelector((state) => state.auth.userData);

  // Default values for the form
  const defaultValues = {
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar?.url || "",
    coverImage: user?.coverImage?.url || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  // Mutation for updating user details along with files
  const updateUser = useMutation({
    mutationFn: async (formData) =>
      axiosInstance.patch("/users/edit-account", formData),
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (data.fullName) formData.append("fullName", data.fullName);
      if (data.username) formData.append("username", data.username);
      if (data.email) formData.append("email", data.email);
      if (data.avatar[0]) formData.append("avatar", data.avatar[0]);
      if (data.coverImage[0]) formData.append("coverImage", data.coverImage[0]);

      await updateUser.mutateAsync(formData);

      toast.success("Update successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed:");
      console.error("Update failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-4 mt-5">
      <Toaster />
      <div className="flex flex-col items-center flex-wrap justify-center gap-y-4 py-4">
        <div className="w-full sm:w-1/2 lg:w-1/3 text-center">
          <h2 className="font-semibold text-xl">Personal Info</h2>
          <p className="text-gray-300">Update your required details.</p>
        </div>
        <div className="w-full sm:w-1/2 lg:w-2/3">
          <div className="rounded-lg border">
            <div className="flex flex-wrap gap-y-4 p-4">
              <Input
                label="Full Name"
                placeholder="Enter your Full Name"
                className="w-1/2"
                {...register("fullName")}
              />

              <div className="w-full">
                <label className="mb-1 inline-block" htmlFor="username">
                  Username
                </label>
                <div className="flex rounded-lg border">
                  <p className="flex shrink-0 items-center border-r border-white px-3 align-middle">
                    videotube.com/
                  </p>
                  <input
                    type="text"
                    className="w-full bg-transparent px-2 py-1.5"
                    id="username"
                    placeholder="@username"
                    {...register("username")}
                  />
                </div>
              </div>

              <Input
                label="Email"
                placeholder="Enter your email"
                {...register("email", {
                  validate: {
                    matchPattern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                        value
                      ) || "Email address must be a valid address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
              <Input
                label="Avatar"
                type="file"
                name="avatar"
                {...register("avatar")}
              />
              <Input
                label="Cover Image"
                name="coverImage"
                type="file"
                {...register("coverImage")}
              />
            </div>
            <hr className="border border-gray-300" />
            <div className="flex items-center justify-end gap-4 p-4">
              <button
                type="button"
                className="inline-block rounded-lg border px-3 py-1.5 hover:bg-white/10"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateUser.isPending}
                className="flex gap-2 bg-[#ae7aff] px-3 py-1.5 text-black disabled:bg-[#d3c4e3]"
              >
                {updateUser.isPending ? (
                  <>
                    <span className="mr-2">Loading</span>
                    <svg
                      width="24"
                      height="24"
                      stroke="#000"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2"
                    >
                      <style>
                        {`.spinner_V8m1{transform-origin:center;animation:spinner_zKoa 2s linear infinite}.spinner_V8m1 circle{stroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite}@keyframes spinner_zKoa{100%{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,100%{stroke-dasharray:42 150;stroke-dashoffset:-59}}`}
                      </style>
                      <g className="spinner_V8m1">
                        <circle
                          cx="12"
                          cy="12"
                          r="9.5"
                          fill="none"
                          strokeWidth="3"
                        ></circle>
                      </g>
                    </svg>
                  </>
                ) : (
                  "Update Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default EditPersonalInfo;
