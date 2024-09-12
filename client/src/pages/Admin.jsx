function Admin() {
  return (
    <div className="mx-auto flex w-full sm:ml-[70px] sm:pb-0 lg:ml-0 flex-col gap-y-6 py-8 px-2 pb-[80px]">
      <div className="flex flex-wrap justify-between gap-4 px-1">
        <div className="block">
          <h1 className="text-2xl font-bold">Welcome Back, React Patterns</h1>
          <p className="text-sm text-gray-300">
            Seamless Video Management, Elevated Results.
          </p>
        </div>
        <div className="block">
          <button className="inline-flex items-center gap-x-2 bg-[#ae7aff] px-3 py-2 font-semibold text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              ></path>
            </svg>{" "}
            Upload video
          </button>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
        <div className="border p-4">
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
          <p className="text-3xl font-semibold">221,234</p>
        </div>
        <div className="border p-4">
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
          <p className="text-3xl font-semibold">4,053</p>
        </div>
        <div className="border p-4">
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
          <p className="text-3xl font-semibold">63,021</p>
        </div>
      </div>
      <div className="overflow-hidden">
        <table className="w-full border-collapse text-white">
          <thead className="hidden md:table-header-group">
            <tr>
              <th className="border-b p-4 text-left">Status</th>
              <th className="border-b p-4 text-left">Uploaded</th>
              <th className="border-b p-4 text-left">Rating</th>
              <th className="border-b p-4 text-left">Date Uploaded</th>
              <th className="border-b p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            <tr className="flex flex-col gap-2 p-4 mb-4 bg-[#1e1e1e] rounded-lg shadow md:table-row md:p-0 md:shadow-none">
              <td className="flex items-center justify-between md:table-cell border-b border-gray-600 py-2 md:py-3">
                <span className="font-semibold md:hidden">Status:</span>
                <span className="rounded-2xl border px-2 py-0.5 border-green-600 text-green-600">
                  Published
                </span>
              </td>
              <td className="flex flex-col md:flex-row items-start md:items-center justify-between md:table-cell border-b border-gray-600 py-2 md:py-3">
                <span className="font-semibold md:hidden">Uploaded:</span>
                <h3 className="text-sm font-semibold">
                  Getting Started with Express.js
                </h3>
              </td>
              <td className="flex items-center justify-between md:table-cell border-b border-gray-600 py-2 md:py-3">
                <span className="font-semibold md:hidden">Rating:</span>
                <div className="flex gap-1">
                  <span className="bg-green-200 text-green-700 text-xs px-2 py-0.5 rounded-lg">
                    137 likes
                  </span>
                  <span className="bg-red-200 text-red-700 text-xs px-2 py-0.5 rounded-lg">
                    107 dislikes
                  </span>
                </div>
              </td>
              <td className="flex items-center justify-between md:table-cell border-b border-gray-600 py-2 md:py-3">
                <span className="font-semibold md:hidden">Date Uploaded:</span>
                <span>9/17/2023</span>
              </td>
              <td className="flex items-center justify-between md:table-cell border-b border-gray-600 py-2 md:py-3">
                <span className="font-semibold md:hidden">Actions:</span>
                <div className="flex gap-2">
                  <button className="h-6 w-6 hover:text-[#ae7aff]">
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
                  <button className="h-6 w-6 hover:text-[#ae7aff]">
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
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
