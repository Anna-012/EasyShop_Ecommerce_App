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
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    };

    fetchProduct();
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>₹{product.price}</p>
      <p>{product.description}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductPage;
