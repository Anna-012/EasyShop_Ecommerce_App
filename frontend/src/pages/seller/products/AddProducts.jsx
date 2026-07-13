import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SellerLayout from "../../../components/seller/SellerLayout";
import toast from "react-hot-toast";

const AddProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!id;

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    sellingPrice: "",
    mrpPrice: "",
    stockQuantity: "",
    images: [],
  });

  const [categories, setCategories] = useState([]);

  const [existingImages, setExistingImages] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo.token;

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/get-product/${id}`,
      );

      const data = await response.json();

      if (response.ok) {
        setProductData({
          title: data.product.title || "",
          description: data.product.description || "",
          category: data.product.category?._id || "",
          brand: data.product.brand || "",
          sellingPrice: data.product.sellingPrice || "",
          mrpPrice: data.product.mrpPrice || "",
          stockQuantity: data.product.stockQuantity || "",
          images: [],
        });

        setExistingImages(data.product.images || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category/get-all-categories");
      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories);
      } else {
        toast.error(data.message || "Failed to load categories");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchCategories();

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setProductData((prev) => ({
      ...prev,
      images: [...e.target.files],
    }));
  };

  const resetForm = () => {
    setProductData({
      title: "",
      description: "",
      category: "",
      brand: "",
      sellingPrice: "",
      mrpPrice: "",
      stockQuantity: "",
      images: [],
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    formData.append("title", productData.title);
    formData.append("description", productData.description);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);
    formData.append("sellingPrice", productData.sellingPrice);
    formData.append("mrpPrice", productData.mrpPrice);
    formData.append("stockQuantity", productData.stockQuantity);

    productData.images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      let response;

      // UPDATE PRODUCT
      if (isEditMode) {
        response = await fetch(
          `http://localhost:5000/api/products/update-product/${id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );
      }

      // CREATE PRODUCT
      else {
        response = await fetch(
          "http://localhost:5000/api/products/createProduct",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );
      }

      const data = await response.json();

      if (response.ok) {
        toast.success(
          isEditMode
            ? "Product updated successfully!"
            : "Product added successfully!",
        );

        navigate("/seller/products");
      } else {
        toast.error(data.message || "Failed to save product");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SellerLayout>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              {isEditMode ? "Update Product" : "Add Product"}
            </h1>
            <p className="text-gray-500 mt-1">
              {isEditMode
                ? "Update your product details."
                : "Fill the details below to add a new product."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              {/* Product Name */}
              <div>
                <label className="block mb-1 font-medium">Product Name</label>
                <input
                  type="text"
                  name="title"
                  value={productData.title}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block mb-1 font-medium">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={productData.brand}
                  onChange={handleChange}
                  placeholder="Brand"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-1 font-medium">Category</label>

                <select
                  name="category"
                  value={productData.category}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock */}
              <div>
                <label className="block mb-1 font-medium">Stock Quantity</label>

                <input
                  type="number"
                  name="stockQuantity"
                  value={productData.stockQuantity}
                  onChange={handleChange}
                  placeholder="Stock"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* Selling */}
              <div>
                <label className="block mb-1 font-medium">Selling Price</label>

                <input
                  type="number"
                  name="sellingPrice"
                  value={productData.sellingPrice}
                  onChange={handleChange}
                  placeholder="₹ Selling Price"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* MRP */}
              <div>
                <label className="block mb-1 font-medium">MRP Price</label>

                <input
                  type="number"
                  name="mrpPrice"
                  value={productData.mrpPrice}
                  onChange={handleChange}
                  placeholder="₹ MRP Price"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* Images */}
              <div>
                <label className="block mb-1 font-medium">Product Images</label>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Preview */}
              <div>
                <label className="block mb-1 font-medium">Preview</label>

                <div className="border rounded-lg h-24 flex items-center gap-2 p-2 overflow-x-auto">
                  {productData.images.length > 0 ? (
                    productData.images.map((image, index) => (
                      <img
                        key={index}
                        src={
                          typeof image === "string"
                            ? image
                            : URL.createObjectURL(image)
                        }
                        alt=""
                        className="w-20 h-20 rounded object-cover border"
                      />
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No Image Selected</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block mb-1 font-medium">Description</label>

                <textarea
                  rows={2}
                  name="description"
                  value={productData.description}
                  onChange={handleChange}
                  placeholder="Product Description"
                  className="w-full border rounded-lg px-3 py-2 resize-none"
                  required
                />
              </div>

              {/* Button */}
              <div className="col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white px-10 py-2 rounded-lg hover:bg-gray-800"
                >
                  {loading
                    ? isEditMode
                      ? "Updating..."
                      : "Adding..."
                    : isEditMode
                      ? "Update Product"
                      : "Add Product"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SellerLayout>
  );
};

export default AddProducts;
