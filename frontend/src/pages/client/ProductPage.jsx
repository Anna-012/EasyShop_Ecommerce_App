import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import API from "../../services/api";
import { CartContext } from "../../context/CartContext";

const ProductPage = () => {
  const { addToCart } = useContext(CartContext);
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Fetch product details
  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null);
      setMessage("");
      setMessageType("");

      try {
        const { data } = await API.get(`/products/get-product/${id}`);

        if (active) {
          setProduct(data.product);
        }
      } catch (error) {
        if (active) {
          setMessage("Unable to load product. Please try again.");
          setMessageType("error");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      active = false;
    };
  }, [id]);

  // Automatically hide success/error messages after 3 seconds
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, messageType]);

  // Add product to cart
  const handleAddToCart = async () => {
    if (addingToCart || !product) return;

    setMessage("");
    setMessageType("");

    const stock = Number(product.stockQuantity ?? 0);

    if (stock <= 0) {
      setMessage("Sorry, this product is out of stock.");
      setMessageType("error");
      return;
    }

    setAddingToCart(true);

    try {
      const success = await addToCart(product);

      if (success) {
        setMessage("Product added to your cart successfully!");
        setMessageType("success");
      } else {
        setMessage("Could not add product. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not add product to cart.",
      );
      setMessageType("error");
    } finally {
      setAddingToCart(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF9FF] px-4 py-12">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="grid gap-10 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
            <div className="h-[420px] rounded-2xl bg-purple-100" />

            <div className="flex flex-col justify-center gap-5">
              <div className="h-8 w-3/4 rounded bg-purple-100" />
              <div className="h-6 w-1/3 rounded bg-purple-100" />
              <div className="h-20 rounded bg-purple-50" />
              <div className="h-12 w-48 rounded-xl bg-purple-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Product not found
  if (!product) {
    return (
      <main className="min-h-screen bg-[#FAF9FF] px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-[#4C1D95]">Product not found</h2>

        <p className="mt-2 text-gray-500">
          Please try opening this product again.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex cursor-pointer items-center rounded-xl bg-[#6D28D9] px-5 py-3 font-semibold text-white transition hover:bg-[#5B21B6]"
        >
          Back to Shopping
        </Link>
      </main>
    );
  }

  // Handle image URL
  const imageUrl = product.images?.[0]
    ? product.images[0].startsWith("http")
      ? product.images[0]
      : `http://localhost:5000/${product.images[0]
          .replace(/\\/g, "/")
          .replace(/^\/+/, "")}`
    : "/no-image.png";

  const stock = Number(product.stockQuantity ?? 0);

  return (
    <main className="min-h-screen bg-[#FAF9FF] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500">
          <Link
            to="/"
            className="cursor-pointer transition hover:text-[#6D28D9]"
          >
            Home
          </Link>

          <span className="mx-2">/</span>

          <span className="font-medium text-[#4C1D95]">{product.title}</span>
        </div>

        {/* Product details */}
        <section className="grid gap-8 overflow-hidden rounded-3xl border border-purple-100 bg-white p-5 shadow-sm sm:p-8 md:grid-cols-2 md:gap-12 md:p-10">
          {/* Product image */}
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-[#F7F5FC] p-4 sm:min-h-[460px]">
            <img
              src={imageUrl}
              alt={product.title}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/no-image.png";
              }}
              className="max-h-[520px] w-full object-contain"
            />
          </div>

          {/* Product information */}
          <div className="flex flex-col justify-center py-2">
            {product.brand && (
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#7C3AED]">
                {product.brand}
              </p>
            )}

            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <p className="text-3xl font-bold text-[#5B21B6]">
                ₹{Number(product.sellingPrice).toLocaleString("en-IN")}
              </p>

              {Number(product.mrpPrice) > Number(product.sellingPrice) && (
                <p className="text-lg text-gray-400 line-through">
                  ₹{Number(product.mrpPrice).toLocaleString("en-IN")}
                </p>
              )}
            </div>

            <div className="my-6 h-px bg-purple-100" />

            {/* Description */}
            <h2 className="mb-2 font-semibold text-gray-900">
              Product Description
            </h2>

            <p className="whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base">
              {product.description}
            </p>

            {/* Stock status */}
            <div className="mt-6">
              <p
                className={`text-sm font-semibold ${
                  stock > 0 ? "text-green-700" : "text-red-600"
                }`}
              >
                {stock > 0
                  ? stock === 1
                    ? "Only 1 item left in stock"
                    : `${stock} items available in stock`
                  : "Out of stock"}
              </p>
            </div>

            {/* Add to Cart button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addingToCart || stock <= 0}
              className="mt-5 w-full cursor-pointer rounded-xl bg-[#6D28D9] px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#5B21B6] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit sm:min-w-52"
            >
              {addingToCart ? "Adding to Cart..." : "Add to Cart"}
            </button>

            {/* Success or error message */}
            {message && (
              <div
                role="status"
                aria-live="polite"
                className={`mt-4 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  messageType === "success"
                    ? "border-purple-200 bg-purple-50 text-[#5B21B6]"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {message}
              </div>
            )}

            <p className="mt-4 text-xs leading-5 text-gray-400">
              Product availability may change before checkout.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductPage;
