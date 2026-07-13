import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } =
    useContext(CartContext);

  const total = cartItems.reduce(
    (acc, item) => acc + item.product.sellingPrice * item.qty,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {cartItems.map((item) => (
            <div
              key={item.product._id}
              className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-20 h-20 object-contain"
                />

                <div>
                  <h3 className="font-medium">{item.product.title}</h3>
                  <p className="text-gray-600">₹{item.product.sellingPrice}</p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex items-center gap-6">
                {/* QTY CONTROL */}
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => decreaseQty(item)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    −
                  </button>

                  <span className="px-4">{item.qty}</span>

                  <button
                    onClick={() => increaseQty(item)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                {/* REMOVE BUTTON */}
                <button
                  onClick={() => removeFromCart(item)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TOTAL */}
      <div className="mt-8 max-w-3xl">
        <h2 className="text-xl font-semibold">Total: ₹{total}</h2>
      </div>

      {cartItems.length > 0 && (
        <Link to="/checkout">
          <button className="mt-4 bg-black text-white px-4 py-2 rounded">
            Proceed to Checkout
          </button>
        </Link>
      )}
    </div>
  );
};

export default CartPage;
