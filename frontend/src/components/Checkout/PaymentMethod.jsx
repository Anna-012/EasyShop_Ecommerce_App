const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Payment Method</h2>

      <label className="flex items-center gap-2 mb-2">
        <input
          type="radio"
          value="COD"
          checked={paymentMethod === "COD"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Cash on Delivery
      </label>

      <label className="flex items-center gap-2">
        <input
          type="radio"
          value="Razorpay"
          checked={paymentMethod === "Razorpay"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Razorpay
      </label>
    </div>
  );
};

export default PaymentMethod;
