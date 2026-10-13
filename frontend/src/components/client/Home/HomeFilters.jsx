const HomeFilters = ({
  categories,
  selectedCategories,
  toggleCategory,
  clearFilters,
  priceLimit,
  highestPrice,
  setMaxPrice,
  loading,
  products,
  inStockOnly,
  setInStockOnly,
}) => {
  return (
    <aside className="w-full shrink-0 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:w-64">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-gray-900">
          <span className="text-[#6D28D9]">☷</span>
          Filters
        </h2>

        <button
          type="button"
          onClick={clearFilters}
          className="text-sm font-medium text-[#6D28D9] hover:text-[#4C1D95]"
        >
          Clear all
        </button>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-800">Categories</h3>

        {categories.length > 0 ? (
          <div className="space-y-3">
            {categories.map((item) => (
              <label
                key={item._id}
                className="flex cursor-pointer items-center gap-3 text-sm text-gray-600 hover:text-[#6D28D9]"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(item.title)}
                  onChange={() => toggleCategory(item.title)}
                  className="h-4 w-4 accent-[#6D28D9]"
                />
                <span>{item.title}</span>
              </label>
            ))}
          </div>
        ) : loading ? (
          <p className="text-sm text-gray-400">Loading categories...</p>
        ) : (
          <p className="text-sm text-gray-400">No categories available.</p>
        )}
      </div>

      <div className="mt-6 border-t border-gray-100 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Maximum price</h3>

          <span className="text-sm font-semibold text-[#6D28D9]">
            ₹{priceLimit.toLocaleString("en-IN")}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max={highestPrice}
          step={Math.max(1, Math.ceil(highestPrice / 100))}
          value={Math.min(priceLimit, highestPrice)}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          disabled={loading || products.length === 0}
          className="w-full cursor-pointer accent-[#6D28D9]"
          aria-label="Maximum product price"
        />

        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>₹0</span>
          <span>₹{highestPrice.toLocaleString("en-IN")}</span>
        </div>

        <button
          type="button"
          onClick={() => setMaxPrice(null)}
          className="mt-3 text-xs font-medium text-[#6D28D9] hover:underline"
        >
          Reset price
        </button>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-5">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => setInStockOnly(event.target.checked)}
            className="h-4 w-4 accent-[#6D28D9]"
          />
          In-stock products only
        </label>
      </div>
    </aside>
  );
};

export default HomeFilters;
