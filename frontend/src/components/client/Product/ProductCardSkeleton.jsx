const ProductCardSkeleton = () => {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-purple-50 bg-white shadow-sm">
      {/* Product image skeleton */}
      <div className="shimmer-bg h-64 w-full bg-[#F7F5FC]" />

      {/* Product details skeleton */}
      <div className="flex flex-1 flex-col p-4">
        {/* Product title */}
        <div className="shimmer-bg mb-3 h-4 w-4/5 rounded-md" />
        <div className="shimmer-bg mb-3 h-4 w-2/5 rounded-md" />

        {/* Brand */}
        <div className="shimmer-bg mb-4 h-3 w-1/3 rounded-md" />

        {/* Price */}
        <div className="mb-3 flex items-center gap-3">
          <div className="shimmer-bg h-6 w-1/3 rounded-md" />
          <div className="shimmer-bg h-4 w-1/4 rounded-md" />
        </div>

        {/* Stock */}
        <div className="shimmer-bg mb-4 h-3 w-1/2 rounded-md" />

        {/* Add to cart button */}
        <div className="shimmer-bg mt-auto h-10 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
