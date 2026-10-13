import { FiTruck, FiCreditCard, FiCheckCircle } from "react-icons/fi";

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {
  const methods = [
    {
      value: "COD",
      title: "Cash on Delivery",
      description: "Pay when your order arrives",
      icon: FiTruck,
    },
    {
      value: "Razorpay",
      title: "Online Payment",
      description: "Pay securely using Razorpay",
      icon: FiCreditCard,
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900">
          Choose payment method
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Select how you would like to pay.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {methods.map((method) => {
          const Icon = method.icon;
          const selected = paymentMethod === method.value;

          return (
            <label
              key={method.value}
              className={`relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200 ${
                selected
                  ? "border-[#6D28D9] bg-purple-50 ring-2 ring-purple-100"
                  : "border-gray-200 bg-white hover:border-purple-200 hover:bg-[#FAF9FF]"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={selected}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#6D28D9]"
              />

              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  selected
                    ? "bg-purple-100 text-[#6D28D9]"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <Icon size={20} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-gray-900">
                  {method.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-gray-500">
                  {method.description}
                </span>
              </span>

              {selected && (
                <FiCheckCircle
                  size={17}
                  className="absolute right-3 top-3 text-[#6D28D9]"
                  aria-hidden="true"
                />
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethod;
