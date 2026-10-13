import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

const CartItem = ({ item, increaseQty, decreaseQty, removeFromCart }) => {
  const product = item.product;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
      {/* Product details */}
      <div className="flex min-w-0 items-center gap-4">
        <Link
          to={`/product/${product._id}`}
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-[#F7F5FC] p-2 sm:h-28 sm:w-28"
        >
          <img
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.title || "Product"}
            className="h-full w-full object-contain"
          />
        </Link>

        <div className="min-w-0">
          <Link
            to={`/product/${product._id}`}
            className="line-clamp-2 font-semibold text-gray-900 transition hover:text-[#6D28D9]"
          >
            {product.title}
          </Link>

          {product.brand && (
            <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
          )}

          <p className="mt-2 text-lg font-bold text-[#4C1D95]">
            ₹{Number(product.sellingPrice).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Quantity and remove */}
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="inline-flex items-center overflow-hidden rounded-lg border border-purple-200">
          <button
            type="button"
            onClick={() => decreaseQty(item)}
            aria-label={`Decrease quantity of ${product.title}`}
            className="p-2.5 text-[#6D28D9] transition hover:bg-purple-50"
          >
            <FiMinus size={16} />
          </button>

          <span
            className="min-w-10 text-center text-sm font-semibold text-gray-800"
            aria-live="polite"
          >
            {item.qty}
          </span>

          <button
            type="button"
            onClick={() => increaseQty(item)}
            aria-label={`Increase quantity of ${product.title}`}
            className="p-2.5 text-[#6D28D9] transition hover:bg-purple-50"
          >
            <FiPlus size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(item)}
          aria-label={`Remove ${product.title} from cart`}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
        >
          <FiTrash2 size={16} />
          <span className="hidden sm:inline">Remove</span>
        </button>
      </div>
    </article>
  );
};

export default CartItem;
