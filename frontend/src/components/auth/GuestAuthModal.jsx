import { Link } from "react-router-dom";
import { FiX, FiLock } from "react-icons/fi";

const GuestAuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-auth-title"
        className="relative w-full max-w-md rounded-2xl border border-purple-100 bg-white p-7 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-purple-50 hover:text-[#6D28D9]"
        >
          <FiX size={20} />
        </button>

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-[#6D28D9]">
          <FiLock size={26} />
        </div>

        <h2
          id="guest-auth-title"
          className="text-center text-2xl font-bold text-[#4C1D95]"
        >
          Please Login or Register
        </h2>

        <p className="mt-3 text-center text-sm leading-6 text-gray-500">
          Please login or create an account before adding products to your
          shopping cart.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <Link
            to="/login"
            onClick={onClose}
            className="rounded-xl bg-[#6D28D9] px-5 py-3 text-center font-semibold text-white hover:bg-[#4C1D95]"
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={onClose}
            className="rounded-xl border border-purple-200 px-5 py-3 text-center font-semibold text-[#6D28D9] hover:bg-purple-50"
          >
            Create an Account
          </Link>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full text-sm text-gray-500 hover:text-[#6D28D9]"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default GuestAuthModal;
