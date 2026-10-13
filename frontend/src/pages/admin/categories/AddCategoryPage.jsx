import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiGrid,
  FiImage,
  FiUploadCloud,
  FiFileText,
  FiTag,
  FiCheckCircle,
} from "react-icons/fi";
import API from "../../../services/api";

const AddCategoryPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select a category image");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    try {
      setLoading(true);

      await API.post("/category/create-category", formData);

      alert("Category Created Successfully");
      navigate("/admin/categories");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-7">
        <button
          type="button"
          onClick={() => navigate("/admin/categories")}
          className="mb-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#6D28D9] transition hover:bg-[#F0E7FC]"
        >
          <FiArrowLeft size={17} />
          Back to Categories
        </button>

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#6D28D9] text-white shadow-lg shadow-purple-900/20">
            <FiGrid size={26} />
          </div>

          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#7952A5]">
              BIRD Management
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-[#352047] sm:text-3xl">
              Add New Category
            </h1>

            <p className="mt-1 text-sm text-[#796B87]">
              Create a category to organize your store products.
            </p>
          </div>
        </div>
      </div>

      {/* Form Layout */}
      <div className="grid max-w-5xl grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main Form */}
        <div className="overflow-hidden rounded-2xl border border-[#E5D6F8] bg-white shadow-sm">
          <div className="border-b border-[#EEE7F5] bg-gradient-to-r from-[#F2E8FF] to-white px-5 py-5 sm:px-7">
            <h2 className="text-lg font-bold text-[#352047]">
              Category Information
            </h2>

            <p className="mt-1 text-sm text-[#796B87]">
              Enter the details below to create your category.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
            {/* Category Name */}
            <div>
              <label
                htmlFor="category-title"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#49365E]"
              >
                <FiTag className="text-[#7C3AED]" size={17} />
                Category Name
                <span className="text-rose-500">*</span>
              </label>

              <input
                id="category-title"
                type="text"
                placeholder="e.g. Men's Clothing"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E5D6F8] bg-[#FCFAFF] px-4 py-3 text-sm text-[#352047] outline-none transition placeholder:text-[#A092AF] focus:border-[#8B5CF6] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
                required
              />

              <p className="mt-2 text-xs text-[#9685A8]">
                Choose a short, clear name for your category.
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="category-description"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#49365E]"
              >
                <FiFileText className="text-[#7C3AED]" size={17} />
                Description
                <span className="text-xs font-normal text-[#A092AF]">
                  (Optional)
                </span>
              </label>

              <textarea
                id="category-description"
                rows={4}
                placeholder="Describe the products included in this category..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-y rounded-xl border border-[#E5D6F8] bg-[#FCFAFF] px-4 py-3 text-sm leading-6 text-[#352047] outline-none transition placeholder:text-[#A092AF] focus:border-[#8B5CF6] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
              />

              <p className="mt-2 text-xs text-[#9685A8]">
                A helpful description makes the category easier to understand.
              </p>
            </div>

            {/* Category Image */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#49365E]">
                <FiImage className="text-[#7C3AED]" size={17} />
                Category Image
                <span className="text-rose-500">*</span>
              </label>

              <label
                htmlFor="category-image"
                className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#CDB5F0] bg-[#FAF6FF] px-5 py-8 text-center transition hover:border-[#8B5CF6] hover:bg-[#F4ECFF]"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="mb-4 h-36 w-36 rounded-2xl border border-[#E5D6F8] bg-white object-cover shadow-sm"
                  />
                ) : (
                  <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6D28D9] text-white shadow-md shadow-purple-900/15 transition group-hover:scale-105">
                    <FiUploadCloud size={29} />
                  </span>
                )}

                <span className="text-sm font-bold text-[#4C1D95]">
                  {image ? "Change Category Image" : "Upload Category Image"}
                </span>

                <span className="mt-2 text-xs text-[#897A98]">
                  Click to browse files from your device
                </span>

                {image && (
                  <span className="mt-3 max-w-full break-all rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#6D28D9]">
                    {image.name}
                  </span>
                )}

                <input
                  id="category-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required={!image}
                />
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#EEE7F5] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/categories")}
                className="rounded-xl border border-[#E5D6F8] bg-white px-5 py-3 text-sm font-semibold text-[#6B587D] transition hover:bg-[#F8F3FF]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-6 py-3 text-sm font-bold text-white shadow-md shadow-purple-900/15 transition hover:bg-[#5B21B6] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiCheckCircle size={17} />
                {loading ? "Creating Category..." : "Create Category"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side Preview / Tips */}
        <aside className="overflow-hidden rounded-2xl border border-[#E5D6F8] bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#6D28D9] via-[#702DD5] to-[#4C1D95] p-5 text-white">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <FiGrid size={23} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-purple-100">
              Category Preview
            </p>

            <h3 className="mt-2 break-words text-xl font-bold">
              {title.trim() || "Your Category"}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-purple-100">
              {description.trim() ||
                "Your category description will appear here."}
            </p>
          </div>

          <div className="p-5">
            <h3 className="font-bold text-[#352047]">Quick Tips</h3>

            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0E7FC] text-[#6D28D9]">
                  <FiTag size={17} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-[#49365E]">
                    Clear naming
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#897A98]">
                    Use names customers can easily recognize.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#6D28D9]">
                  <FiImage size={17} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-[#49365E]">
                    Good quality image
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#897A98]">
                    Choose a clear image that represents the category.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#7C3AED]">
                  <FiCheckCircle size={17} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-[#49365E]">
                    Keep it relevant
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#897A98]">
                    Group similar products under the same category.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-[#E5D6F8] bg-[#F8F3FF] p-4">
              <p className="text-xs font-bold text-[#5B21B6]">
                <FiCheckCircle className="mr-1 inline" size={14} />
                Ready to organize?
              </p>

              <p className="mt-1 text-xs leading-5 text-[#796B87]">
                Create your category to keep the BIRD store organized.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AddCategoryPage;
