import { useEffect, useState } from "react";
import {
  FiImage,
  FiPackage,
  FiTag,
  FiLayers,
  FiDollarSign,
  FiBox,
  FiFileText,
  FiPlus,
  FiLoader,
} from "react-icons/fi";

// IMPORTANT: Keep Field outside ProductForm.
// This prevents inputs from remounting on every keystroke.
const inputClass =
  "w-full rounded-lg border border-gray-200 bg-[#FAF9FF] px-3 py-2 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-purple-200 focus:border-[#6D28D9] focus:bg-white focus:ring-2 focus:ring-purple-100";

const labelClass = "mb-1.5 block text-xs font-semibold text-gray-700";

const Field = ({ label, icon: Icon, children }) => (
  <div className="min-w-0">
    <label className={labelClass}>
      {Icon && (
        <Icon className="mr-1.5 inline-block text-[#6D28D9]" size={13} />
      )}
      {label}
    </label>

    {children}
  </div>
);

const ProductForm = ({
  productData,
  categories,
  handleChange,
  handleImageChange,
  handleSubmit,
  loading,
  isEditMode,
  fileInputRef,
  existingImages,
}) => {
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    const urls = (productData.images || [])
      .filter((image) => image instanceof File)
      .map((image) => URL.createObjectURL(image));

    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [productData.images]);

  const selectedImages =
    previewUrls.length > 0 ? previewUrls : existingImages || [];

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Product Name */}
        <Field label="Product Name" icon={FiPackage}>
          <input
            type="text"
            name="title"
            value={productData.title ?? ""}
            onChange={handleChange}
            placeholder="Enter product name"
            className={inputClass}
            required
          />
        </Field>

        {/* Brand */}
        <Field label="Brand" icon={FiTag}>
          <input
            type="text"
            name="brand"
            value={productData.brand ?? ""}
            onChange={handleChange}
            placeholder="Enter brand name"
            className={inputClass}
            required
          />
        </Field>

        {/* Category */}
        <Field label="Category" icon={FiLayers}>
          <select
            name="category"
            value={productData.category ?? ""}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
        </Field>

        {/* Selling Price */}
        <Field label="Selling Price (₹)" icon={FiDollarSign}>
          <input
            type="number"
            name="sellingPrice"
            value={productData.sellingPrice ?? ""}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className={inputClass}
            required
          />
        </Field>

        {/* MRP */}
        <Field label="MRP Price (₹)" icon={FiDollarSign}>
          <input
            type="number"
            name="mrpPrice"
            value={productData.mrpPrice ?? ""}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className={inputClass}
            required
          />
        </Field>

        {/* Stock */}
        <Field label="Stock Quantity" icon={FiBox}>
          <input
            type="number"
            name="stockQuantity"
            value={productData.stockQuantity ?? ""}
            onChange={handleChange}
            placeholder="Available units"
            min="0"
            step="1"
            className={inputClass}
            required
          />
        </Field>

        {/* Description */}
        <div className="sm:col-span-2 lg:col-span-3">
          <Field label="Product Description" icon={FiFileText}>
            <textarea
              rows={2}
              name="description"
              value={productData.description ?? ""}
              onChange={handleChange}
              placeholder="Describe your product, its features and details..."
              className={`${inputClass} min-h-[68px] resize-y`}
              required
            />
          </Field>
        </div>

        {/* Image Upload */}
        <div className="min-w-0 sm:col-span-2 lg:col-span-3">
          <Field label="Product Images" icon={FiImage}>
            <div className="flex flex-col gap-3 rounded-xl border border-dashed border-purple-200 bg-[#FAF9FF] p-3 sm:flex-row sm:items-center">
              <label className="flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border border-purple-100 bg-white px-4 py-3 transition hover:border-[#6D28D9] hover:bg-purple-50 sm:min-w-64">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-[#6D28D9]">
                  <FiPlus size={19} />
                </span>

                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-gray-800">
                    Choose images
                  </span>

                  <span className="mt-0.5 block text-xs text-gray-500">
                    JPG, PNG or WEBP
                  </span>
                </span>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>

              <div className="min-w-0 flex-1">
                {selectedImages.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="relative h-14 w-14 overflow-hidden rounded-lg border border-purple-100 bg-white"
                      >
                        <img
                          src={image}
                          alt={`Product preview ${index + 1}`}
                          className="h-full w-full object-contain p-1"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs leading-5 text-gray-500">
                    {isEditMode
                      ? "Choose new images only if you want to upload replacements."
                      : "Select one or more images to preview them here."}
                  </p>
                )}
              </div>
            </div>
          </Field>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end border-t border-gray-100 pt-4 sm:col-span-2 lg:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#6D28D9] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" size={16} />
                {isEditMode ? "Updating Product..." : "Adding Product..."}
              </>
            ) : (
              <>
                <FiPlus size={17} />
                {isEditMode ? "Update Product" : "Add Product"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
