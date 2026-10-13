import { useContext } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiArrowLeft } from "react-icons/fi";

import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

import CartSkeleton from "../../components/client/Cart/CartSkeleton";
import CartItem from "../../components/client/Cart/CartItem";
import CartSummary from "../../components/client/Cart/CartSummary";
import EmptyCart from "../../components/client/Cart/EmptyCart";

const CartPage = () => {
  const {
    cartItems,
    cartLoading,
    cartError,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useContext(CartContext);

  const { userInfo } = useContext(AuthContext);
  const isLoggedIn = Boolean(userInfo);

  // Loading state
  if (isLoggedIn && cartLoading) {
    return <CartSkeleton />;
  }

  // Error state
  if (isLoggedIn && cartError) {
    return (
      <main className="min-h-screen bg-[#FAF9FF] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-purple-100 bg-white px-5 py-16 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-purple-50">
            <FiShoppingBag size={28} className="text-[#6D28D9]" />
          </div>

          <h2 className="text-xl font-bold text-[#4C1D95]">
            Unable to load your cart
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            Please check your connection and try again.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 cursor-pointer rounded-xl bg-[#6D28D9] px-6 py-3 font-semibold text-white transition hover:bg-[#4C1D95]"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // Total calculation
  const total = cartItems.reduce(
    (acc, item) => acc + Number(item.product.sellingPrice) * item.qty,
    0,
  );

  return (
    <main className="min-h-screen bg-[#FAF9FF] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {cartItems.length === 0 ? (
          <EmptyCart isLoggedIn={isLoggedIn} />
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px]">
            {/* Cart items */}
            <section className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-purple-100 bg-white px-5 py-4">
                <h2 className="font-semibold text-gray-900">Cart Items</h2>

                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-[#5B21B6]">
                  {cartItems.reduce((count, item) => count + item.qty, 0)} items
                </span>
              </div>

              {cartItems.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  increaseQty={increaseQty}
                  decreaseQty={decreaseQty}
                  removeFromCart={removeFromCart}
                />
              ))}

              {/* Back to Shopping */}
              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-purple-200 bg-white px-5 py-3 text-sm font-semibold text-[#6D28D9] shadow-sm transition hover:border-purple-400 hover:bg-purple-50"
                >
                  <FiArrowLeft size={17} />
                  Back to Shopping
                </Link>
              </div>
            </section>

            {/* Order summary */}
            <CartSummary total={total} />
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
