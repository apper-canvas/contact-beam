import React from "react";

const Loading = () => {
return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-surface border-b border-gray-200 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="skeleton h-6 lg:h-8 w-32 lg:w-48 rounded-lg mb-3 lg:mb-4"></div>
          <div className="skeleton h-8 lg:h-10 w-full max-w-sm lg:max-w-md rounded-lg"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
<div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Contact List Skeleton */}
          <div className="w-full lg:w-2/5">
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
<div key={index} className="bg-surface p-4 lg:p-6 rounded-lg border border-gray-200">
<div className="skeleton h-5 lg:h-6 w-24 lg:w-32 rounded mb-2"></div>
                  <div className="skeleton h-3 lg:h-4 w-20 lg:w-24 rounded mb-3"></div>
                  <div className="flex gap-1 lg:gap-2 mb-3">
                    <div className="skeleton h-5 lg:h-6 w-12 lg:w-16 rounded-full"></div>
                    <div className="skeleton h-5 lg:h-6 w-16 lg:w-20 rounded-full"></div>
                  </div>
                  <div className="skeleton h-3 lg:h-4 w-full rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Panel Skeleton */}
<div className="w-full lg:flex-1">
            <div className="bg-surface p-4 lg:p-8 rounded-lg border border-gray-200">
<div className="skeleton h-6 lg:h-8 w-32 lg:w-40 rounded mb-4 lg:mb-6"></div>
<div className="space-y-4 lg:space-y-6">
                <div>
                  <div className="skeleton h-3 lg:h-4 w-12 lg:w-16 rounded mb-2"></div>
                  <div className="skeleton h-5 lg:h-6 w-40 lg:w-48 rounded"></div>
                </div>
                <div>
                  <div className="skeleton h-3 lg:h-4 w-12 lg:w-16 rounded mb-2"></div>
                  <div className="skeleton h-5 lg:h-6 w-24 lg:w-32 rounded"></div>
                </div>
                <div>
                  <div className="skeleton h-3 lg:h-4 w-12 lg:w-16 rounded mb-2"></div>
                  <div className="skeleton h-5 lg:h-6 w-32 lg:w-40 rounded"></div>
                </div>
                <div>
                  <div className="skeleton h-3 lg:h-4 w-12 lg:w-16 rounded mb-2"></div>
                  <div className="skeleton h-16 lg:h-20 w-full rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;