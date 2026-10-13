import { Link } from "react-router-dom";
import ProductCardSkeleton from "../Product/ProductCardSkeleton";

const ProductGrid = ({
  loading,
  error,
  products,
  onAddToCart,
  onClearFilters,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white px-5 py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Unable to load products
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Please check your connection and try again.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 rounded-lg bg-[#6D28D9] px-5 py-2.5 font-medium text-white transition hover:bg-[#4C1D95]"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-purple-100 bg-white px-5 py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-2xl">
          ♡
        </div>

        <h2 className="text-xl font-semibold text-gray-900">
          No products found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Try changing your search or removing some filters.
        </p>

        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 rounded-lg bg-[#6D28D9] px-5 py-2.5 font-medium text-white transition hover:bg-[#4C1D95]"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => {
        const inStock = Number(product.stockQuantity) > 0;

        return (
          <article
            key={product._id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-purple-50 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
          >
            <Link
              to={`/product/${product._id}`}
              className="flex h-64 items-center justify-center overflow-hidden bg-[#F7F5FC] p-4"
            >
              <img
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.title || "Product"}
                loading="lazy"
                className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
              />
            </Link>

            <div className="flex flex-1 flex-col p-4">
              <Link to={`/product/${product._id}`}>
                <h3 className="line-clamp-2 font-semibold text-gray-900 transition hover:text-[#6D28D9]">
                  {product.title}
                </h3>
              </Link>

              {product.brand && (
                <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
              )}

              <div className="mt-3 flex flex-wrap items-baseline gap-2">
                <span className="text-xl font-bold text-[#4C1D95]">
                  ₹{product.sellingPrice}
                </span>

                {Number(product.mrpPrice) > Number(product.sellingPrice) && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.mrpPrice}
                  </span>
                )}
              </div>

              <p
                className={`mt-2 text-xs font-medium ${
                  inStock ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {inStock ? `${product.stockQuantity} in stock` : "Out of stock"}
              </p>

              <button
                type="button"
                onClick={() => onAddToCart(product)}
                disabled={!inStock}
                className={`mt-auto w-full rounded-lg py-2.5 text-sm font-semibold transition ${
                  inStock
                    ? "mt-4 bg-[#6D28D9] text-white hover:bg-[#4C1D95]"
                    : "mt-4 cursor-not-allowed bg-gray-100 text-gray-400"
                }`}
              >
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ProductGrid;
