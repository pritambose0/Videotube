const VideoCardSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="relative mb-2 w-full pt-[56%] bg-gray-700 rounded-md">
        <div className="absolute inset-0 bg-gray-800 rounded"></div>
        <span className="absolute bottom-1 right-1 h-4 w-10 bg-gray-600 rounded"></span>
      </div>
      <div className="flex gap-x-2 mx-2">
        <div className="h-10 w-10 shrink-0 bg-gray-700 rounded-full"></div>
        <div className="w-full space-y-2">
          <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
          <div className="h-3 w-1/2 bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;
