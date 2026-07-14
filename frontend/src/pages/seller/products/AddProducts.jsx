import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SellerLayout from "../../../components/seller/SellerLayout";
import toast from "react-hot-toast";
import API from "../../../services/api";
import ProductForm from "../../../components/seller/products/ProductForm";

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
      const { data } = await API.get(`/products/get-product/${id}`);
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
      const { data } = await API.get("/category/get-all-categories");

      console.log(data);

      setCategories(data.categories);
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

          <ProductForm
            productData={productData}
            categories={categories}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            handleSubmit={handleSubmit}
            loading={loading}
            isEditMode={isEditMode}
            fileInputRef={fileInputRef}
            existingImages={existingImages}
          />
        </div>
      </div>
    </SellerLayout>
  );
};

export default AddProducts;
