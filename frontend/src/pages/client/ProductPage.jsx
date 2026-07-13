import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

const ProductPage = () => {
  const { addToCart } = useContext(CartContext);
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await API.get(`/products/get-product/${id}`);
      console.log("PRODUCT:", data.product);

      setProduct(data.product);
    };

    fetchProduct();
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="grid md:grid-cols-2 gap-10 bg-white p-8 rounded-lg shadow">
        {/* Product Image */}
        <div className="flex justify-center">
          <img
            src={
              product.images?.length > 0
                ? `http://localhost:5000/${product.images[0].replace(/\\/g, "/")}`
                : "/no-image.png"
            }
            alt={product.title}
            className="w-full max-w-md rounded-lg object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

          <p className="text-2xl font-semibold text-green-600 mb-4">
            ₹{product.sellingPrice}
          </p>

          <p className="text-gray-700 mb-6">{product.description}</p>

          <button
            onClick={() => {
              addToCart(product);
            }}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
