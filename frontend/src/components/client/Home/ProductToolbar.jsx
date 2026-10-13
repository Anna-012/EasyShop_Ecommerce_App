const ProductToolbar = ({
  search,
  loading,
  error,
  productCount,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-xl border border-purple-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-semibold text-gray-900">
          {search ? `Results for "${search}"` : "All Products"}
        </h2>

        {!loading && !error && (
          <p className="mt-1 text-sm text-gray-500">
            {productCount} products found
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor="sort-products"
          className="whitespace-nowrap text-sm text-gray-500"
        >
          Sort by
        </label>

        <select
          id="sort-products"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100"
        >
          <option value="default">Recommended</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>
    </div>
  );
};

export default ProductToolbar;
