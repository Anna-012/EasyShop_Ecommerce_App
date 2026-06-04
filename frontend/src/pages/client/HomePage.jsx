import { useEffect, useState, useContext } from "react";
import API from "../../services/api";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await API.get("/products/get-all-products");
      setProducts(res.data.products);
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {products.map((p) => (
          <div key={p._id}>
            {/* Image */}
            <div className="bg-white rounded-md hover:shadow-lg transition duration-300 flex flex-col">
              <div className="w-full h-72 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={p.image}
                  className="max-h-full max-w-full object-contain scale-110"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <Link to={`/product/${p._id}`}>
                  <h3>{p.name}</h3>
                </Link>

                <p className="text-lg font-semibold text-gray-900 mt-1">
                  ₹{p.price}
                </p>

                <button
                  onClick={() => addToCart(p)}
                  className="mt-4 bg-black text-white py-2 rounded-md hover:bg-gray-800 text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
