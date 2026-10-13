import { Link } from "react-router-dom";
import { FiShoppingBag, FiArrowRight, FiLock } from "react-icons/fi";

const EmptyCart = ({ isLoggedIn }) => {
  return (
    <section className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-purple-100 bg-white px-5 py-12 text-center shadow-sm sm:min-h-[400px] sm:px-10">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#EDE9FE]">
        <FiShoppingBag size={34} className="text-[#6D28D9]" />
      </div>

      <h2 className="text-xl font-bold text-[#4C1D95] sm:text-2xl">
        Your cart is empty
      </h2>

      {isLoggedIn ? (
        <>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
            You haven't added any products yet. Explore our collection and find
            something you love.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-6 py-3 font-semibold text-white transition hover:bg-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
          >
            Continue Shopping
            <FiArrowRight size={18} />
          </Link>
        </>
      ) : (
        <>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
            Please log in if you already have an account, or register to create
            a new account and continue shopping with BIRD.
          </p>

          <div className="mt-7 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-5 py-3 font-semibold text-white transition hover:bg-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
            >
              <FiLock size={17} />
              Login
            </Link>

            <Link
              to="/register"
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-purple-200 bg-white px-5 py-3 font-semibold text-[#6D28D9] transition hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
            >
              Register
            </Link>
          </div>

          <Link
            to="/"
            className="mt-6 text-sm font-medium text-gray-500 transition hover:text-[#6D28D9]"
          >
            Continue Shopping
          </Link>
        </>
      )}
    </section>
  );
};

export default EmptyCart;
