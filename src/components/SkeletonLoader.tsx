import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl sm:rounded-3xl p-1 sm:p-3.5 border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] animate-pulse flex flex-col justify-between h-full space-y-1 sm:space-y-2">
      {/* Image Skeleton */}
      <div className="relative aspect-square w-full bg-zinc-200 rounded-lg sm:rounded-2xl overflow-hidden mb-1 sm:mb-2" />

      {/* Info Skeletons */}
      <div className="space-y-1 sm:space-y-1.5 flex-1 flex flex-col justify-between px-0.5">
        {/* Rating & Stock row */}
        <div className="flex items-center justify-between gap-2">
          <div className="h-2.5 w-14 bg-zinc-200 rounded" />
          <div className="h-2.5 w-10 bg-zinc-200 rounded" />
        </div>

        {/* Title */}
        <div className="h-3 w-3/4 bg-zinc-200 rounded" />

        {/* Price */}
        <div className="h-3.5 w-1/3 bg-zinc-200 rounded" />

        {/* Button */}
        <div className="h-[22px] sm:h-[34px] w-full bg-zinc-200 rounded sm:rounded-xl mt-0.5" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
