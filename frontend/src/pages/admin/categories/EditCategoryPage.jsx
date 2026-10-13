import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiGrid,
  FiImage,
  FiUploadCloud,
  FiFileText,
  FiTag,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi";
import API from "../../../services/api";

const EditCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    setLoading(true);

    try {
      const { data } = await API.get(`/category/get-category/${id}`);

      setTitle(data.category.title || "");
      setDescription(data.category.description || "");
      setCurrentImage(data.category.imageUrl || "");
      setImage(null);
      setImagePreview("");
    } catch (error) {
      console.error(error);
      alert("Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);

    if (image) {
      formData.append("image", image);
    }

    try {
      setUpdating(true);

      await API.put(`/category/update-category/${id}`, formData);

      alert("Category updated successfully");
      navigate("/admin/categories");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update category");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F8F7FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6D28D9] text-white shadow-lg shadow-purple-900/20">
            <FiRefreshCw size={25} className="animate-spin" />
          </div>
          <p className="text-sm font-semibold text-[#6D28D9]">
            Loading Category...
          </p>
        </div>
      </div>
    );
  }

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
              Edit Category
            </h1>

            <p className="mt-1 text-sm text-[#796B87]">
              Update your category information and image.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid max-w-5xl grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_300px]">
        {/* Edit Form */}
        <section className="overflow-hidden rounded-2xl border border-[#E5D6F8] bg-white shadow-sm">
          <div className="border-b border-[#EEE7F5] bg-gradient-to-r from-[#F2E8FF] to-white px-5 py-5 sm:px-7">
            <h2 className="text-lg font-bold text-[#352047]">
              Category Information
            </h2>
            <p className="mt-1 text-sm text-[#796B87]">
              Make the required changes below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
            {/* Category Name */}
            <div>
              <label
                htmlFor="category-title"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#49365E]"
              >
                <FiTag size={17} className="text-[#7C3AED]" />
                Category Name
                <span className="text-rose-500">*</span>
              </label>

              <input
                id="category-title"
                type="text"
                placeholder="Enter category name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#E5D6F8] bg-[#FCFAFF] px-4 py-3 text-sm text-[#352047] outline-none transition placeholder:text-[#A092AF] focus:border-[#8B5CF6] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="category-description"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#49365E]"
              >
                <FiFileText size={17} className="text-[#7C3AED]" />
                Description
                <span className="text-xs font-normal text-[#A092AF]">
                  (Optional)
                </span>
              </label>

              <textarea
                id="category-description"
                rows={4}
                placeholder="Describe this category..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-y rounded-xl border border-[#E5D6F8] bg-[#FCFAFF] px-4 py-3 text-sm leading-6 text-[#352047] outline-none transition placeholder:text-[#A092AF] focus:border-[#8B5CF6] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
              />
            </div>

            {/* Current / Selected Image */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#49365E]">
                <FiImage size={17} className="text-[#7C3AED]" />
                Category Image
              </label>

              <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border border-[#EEE7F5] bg-[#FCFAFF] p-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E5D6F8] bg-white">
                  {imagePreview || currentImage ? (
                    <img
                      src={imagePreview || currentImage}
                      alt={title || "Category preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiImage size={28} className="text-[#B9A4D2]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#49365E]">
                    {image ? "New image selected" : "Current category image"}
                  </p>

                  <p className="mt-1 break-all text-xs leading-5 text-[#897A98]">
                    {image
                      ? image.name
                      : "Your current image will be retained unless you choose another."}
                  </p>

                  {image && (
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <FiCheckCircle size={14} />
                      Ready to upload
                    </span>
                  )}
                </div>
              </div>

              <label
                htmlFor="category-image"
                className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#CDB5F0] bg-[#FAF6FF] px-5 py-6 text-center transition hover:border-[#8B5CF6] hover:bg-[#F4ECFF]"
              >
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#6D28D9] text-white shadow-md shadow-purple-900/15 transition group-hover:scale-105">
                  <FiUploadCloud size={24} />
                </span>

                <span className="text-sm font-bold text-[#4C1D95]">
                  {image ? "Choose a different image" : "Change Category Image"}
                </span>

                <span className="mt-1 text-xs text-[#897A98]">
                  Click to select a new image from your device
                </span>

                <input
                  id="category-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Actions */}
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
                disabled={updating}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-6 py-3 text-sm font-bold text-white shadow-md shadow-purple-900/15 transition hover:bg-[#5B21B6] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updating ? (
                  <FiRefreshCw size={17} className="animate-spin" />
                ) : (
                  <FiCheckCircle size={17} />
                )}
                {updating ? "Updating Category..." : "Update Category"}
              </button>
            </div>
          </form>
        </section>

        {/* Right Side Preview */}
        <aside className="overflow-hidden rounded-2xl border border-[#E5D6F8] bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#6D28D9] via-[#702DD5] to-[#4C1D95] p-5 text-white">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <FiGrid size={23} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-purple-100">
              Live Preview
            </p>

            <h3 className="mt-2 break-words text-xl font-bold">
              {title.trim() || "Your Category"}
            </h3>

            <p className="mt-2 line-clamp-4 text-sm leading-6 text-purple-100">
              {description.trim() ||
                "Your category description will appear here."}
            </p>
          </div>

          <div className="p-5">
            <h3 className="font-bold text-[#352047]">Image Preview</h3>

            <div className="mt-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-[#E5D6F8] bg-[#FAF6FF]">
              {imagePreview || currentImage ? (
                <img
                  src={imagePreview || currentImage}
                  alt={title || "Category"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#A092AF]">
                  <FiImage size={35} />
                  <span className="text-xs">No image available</span>
                </div>
              )}
            </div>

            <div className="mt-5 rounded-xl border border-[#E5D6F8] bg-[#F8F3FF] p-4">
              <p className="flex items-center gap-2 text-xs font-bold text-[#5B21B6]">
                <FiCheckCircle size={15} />
                Keep your category updated
              </p>

              <p className="mt-2 text-xs leading-5 text-[#796B87]">
                Review the category name, description and image before saving
                your changes.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EditCategoryPage;
