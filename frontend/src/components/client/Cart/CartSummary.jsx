import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const CartSummary = ({ total }) => {
  const formattedTotal = total.toLocaleString("en-IN");

  return (
    <aside className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <h2 className="text-lg font-bold text-[#4C1D95]">Order Summary</h2>

      <div className="mt-5 space-y-4">
        <div className="flex justify-between gap-4 text-sm text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">₹{formattedTotal}</span>
        </div>

        <div className="flex justify-between gap-4 text-sm text-gray-600">
          <span>Shipping</span>
          <span className="text-xs text-gray-500">Calculated at checkout</span>
        </div>

        <div className="border-t border-purple-100 pt-4">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-gray-900">Subtotal</span>

            <span className="text-xl font-bold text-[#4C1D95]">
              ₹{formattedTotal}
            </span>
          </div>
        </div>
      </div>

      <Link
        to="/checkout"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-5 py-3 font-semibold text-white transition hover:bg-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
      >
        Proceed to Checkout
        <FiArrowRight size={18} />
      </Link>

      <Link
        to="/"
        className="mt-4 block text-center text-sm font-medium text-gray-500 transition hover:text-[#6D28D9]"
      >
        Continue Shopping
      </Link>

      <p className="mt-5 text-center text-xs leading-5 text-gray-400">
        Shipping and any applicable charges are calculated at checkout.
      </p>
    </aside>
  );
};

export default CartSummary;
