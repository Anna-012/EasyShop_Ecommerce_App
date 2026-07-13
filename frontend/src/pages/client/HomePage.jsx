import { useEffect, useState, useContext } from "react";
import API from "../../services/api";
import { CartContext } from "../../context/CartContext";
import { useSearchParams, Link } from "react-router-dom";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);

  const { addToCart } = useContext(CartContext);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/category/get-all-categories");
      setCategories(data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products/get-all-products");
        setProducts(res.data.products);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchSearch = search
      ? product.title.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchCategory = category ? product.category.title === category : true;

    return matchSearch && matchCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Products</h1>
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {filteredProducts.map((p) => (
              <div key={p._id}>
                <div className="bg-white rounded-md hover:shadow-lg transition duration-300 flex flex-col h-full">
                  {/* Product Image */}
                  <div className="w-full h-72 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-72 bg-gray-100 flex items-center justify-center">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <Link to={`/product/${p._id}`}>
                      <h3 className="font-medium hover:text-blue-600">
                        {p.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-500 mt-1">{p.brand}</p>

                    <div className="mt-2">
                      <span className="text-lg font-semibold text-gray-900">
                        ₹{p.sellingPrice}
                      </span>

                      {p.mrpPrice > p.sellingPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₹{p.mrpPrice}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mt-2">
                      {p.stockQuantity > 0
                        ? `${p.stockQuantity} in stock`
                        : "Out of stock"}
                    </p>

                    <button
                      onClick={() => addToCart(p)}
                      disabled={p.stockQuantity === 0}
                      className={`mt-4 py-2 rounded-md text-sm ${
                        p.stockQuantity > 0
                          ? "bg-black text-white hover:bg-gray-800"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {p.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
