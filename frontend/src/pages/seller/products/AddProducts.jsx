import { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiArrowLeft,
  FiPlus,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import SellerLayout from "../../../components/seller/SellerLayout";
import API from "../../../services/api";
import ProductForm from "../../../components/seller/products/ProductForm";
import { AuthContext } from "../../../context/AuthContext";

const AddProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const isEditMode = Boolean(id);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(Boolean(id));
  const [pageError, setPageError] = useState("");

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

  // Load categories and product details when editing
  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const { data } = await API.get("/category/get-all-categories");

        if (active) {
          setCategories(Array.isArray(data.categories) ? data.categories : []);
        }
      } catch (error) {
        console.error("Category loading error:", error);

        if (active) {
          toast.error(
            error.response?.data?.message || "Failed to load categories",
          );
        }
      }
    };

    const loadProduct = async () => {
      try {
        const { data } = await API.get(`/products/get-product/${id}`);

        if (!active) return;

        const product = data.product;

        setProductData({
          title: product.title || "",
          description: product.description || "",
          category: product.category?._id || product.category || "",
          brand: product.brand || "",
          sellingPrice: product.sellingPrice ?? "",
          mrpPrice: product.mrpPrice ?? "",
          stockQuantity: product.stockQuantity ?? "",
          images: [],
        });

        setExistingImages(product.images || []);
      } catch (error) {
        console.error("Product loading error:", error);

        if (active) {
          setPageError(
            error.response?.data?.message || "Failed to load product details.",
          );
        }
      } finally {
        if (active) setPageLoading(false);
      }
    };

    loadCategories();

    if (id) {
      loadProduct();
    }

    return () => {
      active = false;
    };
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
      images: Array.from(e.target.files || []),
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

    setExistingImages([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo?.token) {
      toast.error("Your session is missing. Please log in again.");
      navigate("/seller/login");
      return;
    }

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
      const endpoint = isEditMode
        ? `/products/update-product/${id}`
        : "/products/createProduct";

      const method = isEditMode ? "put" : "post";

      // API interceptor attaches the stored Bearer token.
      // Do not manually set Content-Type for FormData.
      const { data } = await API[method](endpoint, formData, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      toast.success(
        data.message ||
          (isEditMode
            ? "Product updated successfully!"
            : "Product added successfully!"),
      );

      navigate("/seller/products");
    } catch (error) {
      console.error("Save product error:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/seller/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to save product.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerLayout>
      <main className="min-h-screen bg-[#FAF9FF] px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Back navigation */}
          <button
            type="button"
            onClick={() => navigate("/seller/products")}
            className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition hover:bg-purple-50 hover:text-[#6D28D9]"
          >
            <FiArrowLeft size={17} />
            Back to Products
          </button>

          {/* Page heading */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#6D28D9]">
              <FiPackage size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {isEditMode ? "Edit Product" : "Add New Product"}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {isEditMode
                  ? "Update your product information and inventory."
                  : "Add product details to your BIRD store."}
              </p>
            </div>
          </div>

          {/* Form container */}
          <section className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
            <div className="h-1 bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-[#A78BFA]" />

            <div className="p-4 sm:p-6 lg:p-8">
              {pageLoading ? (
                <div className="space-y-5 py-8">
                  <div className="h-5 w-40 animate-pulse rounded bg-purple-100" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="h-11 animate-pulse rounded-lg bg-gray-100"
                      />
                    ))}
                  </div>
                </div>
              ) : pageError ? (
                <div className="py-10 text-center">
                  <FiAlertCircle
                    size={30}
                    className="mx-auto mb-3 text-red-500"
                  />

                  <p className="font-semibold text-gray-900">
                    Couldn't load this product
                  </p>

                  <p className="mt-2 text-sm text-gray-500">{pageError}</p>

                  <button
                    type="button"
                    onClick={() => navigate("/seller/products")}
                    className="mt-5 rounded-lg bg-[#6D28D9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4C1D95]"
                  >
                    Back to Products
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Product Information
                      </h2>

                      <p className="mt-1 text-xs text-gray-500">
                        Fields and image requirements follow your product form.
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-[#6D28D9]">
                      {isEditMode ? "Edit mode" : "New product"}
                    </span>
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

                  {!isEditMode && (
                    <div className="mt-5 flex justify-end border-t border-gray-100 pt-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg border border-purple-200 px-4 py-2 text-sm font-medium text-[#6D28D9] transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FiRefreshCw size={15} />
                        Clear form
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </SellerLayout>
  );
};

export default AddProducts;
