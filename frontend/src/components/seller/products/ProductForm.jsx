

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
  return (
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

        {/* Selling Price */}
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
            ) : existingImages.length > 0 ? (
              existingImages.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
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
  );
};

export default ProductForm;
