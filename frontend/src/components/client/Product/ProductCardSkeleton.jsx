const ProductCardSkeleton = () => {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-purple-50 bg-white shadow-sm">
      <div className="shimmer-bg h-64 w-full bg-[#F7F5FC]" />

      <div className="flex flex-1 flex-col p-4">
        <div className="shimmer-bg mb-3 h-4 w-4/5 rounded-md" />
        <div className="shimmer-bg mb-3 h-4 w-2/5 rounded-md" />

        <div className="shimmer-bg mb-4 h-3 w-1/3 rounded-md" />

        <div className="mb-3 flex items-center gap-3">
          <div className="shimmer-bg h-6 w-1/3 rounded-md" />
          <div className="shimmer-bg h-4 w-1/4 rounded-md" />
        </div>

        <div className="shimmer-bg mb-4 h-3 w-1/2 rounded-md" />

        <div className="shimmer-bg mt-auto h-10 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
