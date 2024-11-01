const PlaylistSkeleton = () => {
  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
        {/* Playlist Card Skeleton */}
        <div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
          <div className="relative mb-2 w-full pt-[56%] bg-gray-700 animate-pulse rounded-md">
            <div className="absolute inset-0 bg-gray-600 rounded-md"></div>
          </div>

          <h6 className="mb-2 h-5 bg-gray-700 rounded-md animate-pulse w-1/2"></h6>
          <p className="h-4 bg-gray-700 rounded-md animate-pulse w-3/4 mb-4"></p>

          <div className="mt-6 flex items-center gap-x-3">
            <div className="h-16 w-16 shrink-0 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="w-full">
              <h6 className="h-5 bg-gray-700 rounded-md animate-pulse w-2/3"></h6>
              <p className="h-4 bg-gray-700 rounded-md w-1/3 animate-pulse mt-1"></p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex gap-x-4">
              <div className="w-36 h-20 bg-gray-700 rounded-md animate-pulse"></div>
              <div className="flex-1">
                <h6 className="h-5 bg-gray-700 rounded-md animate-pulse w-3/4 mb-2"></h6>
                <p className="h-4 bg-gray-700 rounded-md animate-pulse w-1/2"></p>
                <p className="h-4 bg-gray-700 rounded-md animate-pulse w-1/3 mt-1"></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlaylistSkeleton;
