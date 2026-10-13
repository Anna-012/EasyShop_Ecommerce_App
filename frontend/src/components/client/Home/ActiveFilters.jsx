const ActiveFilters = ({
  selectedCategories,
  inStockOnly,
  maxPrice,
  priceLimit,
  toggleCategory,
  setInStockOnly,
  setMaxPrice,
}) => {
  const hasActiveFilters =
    selectedCategories.length > 0 || inStockOnly || maxPrice !== null;

  if (!hasActiveFilters) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {selectedCategories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => toggleCategory(category)}
          className="rounded-full bg-purple-100 px-3 py-1.5 text-xs font-medium text-[#5B21B6] hover:bg-purple-200"
        >
          {category} ×
        </button>
      ))}

      {inStockOnly && (
        <button
          type="button"
          onClick={() => setInStockOnly(false)}
          className="rounded-full bg-purple-100 px-3 py-1.5 text-xs font-medium text-[#5B21B6] hover:bg-purple-200"
        >
          In stock ×
        </button>
      )}

      {maxPrice !== null && (
        <button
          type="button"
          onClick={() => setMaxPrice(null)}
          className="rounded-full bg-purple-100 px-3 py-1.5 text-xs font-medium text-[#5B21B6] hover:bg-purple-200"
        >
          Up to ₹{priceLimit.toLocaleString("en-IN")} ×
        </button>
      )}
    </div>
  );
};

export default ActiveFilters;
